import BLOG from '@/blog.config'
import { getDateValue, getTextContent } from 'notion-utils'
import formatDate from '../../utils/formatDate'
// import { createHash } from 'crypto'
import { siteConfig } from '../../config'
import { convertUrlStartWithOneSlash, getLastSegmentFromUrl, isHttpLink, isMailOrTelLink } from '../../utils'
import { extractLangPrefix } from '../../utils/pageId'
import {
  isMd5Digest,
  isSHA256Digest,
  sha256Digest
} from '../../utils/password'
import { mapImgUrl } from './mapImage'
import notionAPI from '@/lib/db/notion/getNotionAPI'

export default async function getPageProperties(
  id,
  value,
  schema,
  authToken,
  tagOptions
) {
  const rawProperties = Object.entries(value?.properties || [])
  const excludeProperties = ['date', 'select', 'multi_select', 'person']
  const properties = {}
  for (let i = 0; i < rawProperties.length; i++) {
    const [key, val] = rawProperties[i]
    properties.id = id
    if (schema[key]?.type && !excludeProperties.includes(schema[key].type)) {
      properties[schema[key].name] = getTextContent(val)
    } else {
      switch (schema[key]?.type) {
        case 'date': {
          const dateProperty = getDateValue(val)
          delete dateProperty.type
          properties[schema[key].name] = dateProperty
          break
        }
        case 'select':
        case 'multi_select': {
          const selects = getTextContent(val)
          if (selects[0]?.length) {
            properties[schema[key].name] = selects.split(',')
          }
          break
        }
        case 'person': {
          const rawUsers = val.flat()
          const users = []

          for (let i = 0; i < rawUsers.length; i++) {
            if (rawUsers[i][0][1]) {
              const userId = rawUsers[i][0]
              const res = await notionAPI.getUsers(userId)
              const resValue =
                res?.recordMapWithRoles?.notion_user?.[userId[1]]?.value
              const user = {
                id: resValue?.id,
                first_name: resValue?.given_name,
                last_name: resValue?.family_name,
                profile_photo: resValue?.profile_photo
              }
              users.push(user)
            }
          }
          properties[schema[key].name] = users
          break
        }
        default:
          break
      }
    }
  }

  const fieldNames = BLOG.NOTION_PROPERTY_NAME
  if (fieldNames) {
    Object.keys(fieldNames).forEach(key => {
      if (fieldNames[key] && properties[fieldNames[key]]) {
        properties[key] = properties[fieldNames[key]]
      }
    })
  }

  properties.type = properties.type?.[0] || ''
  properties.status = properties.status?.[0] || ''
  properties.category = properties.category?.[0] || ''
  properties.comment = properties.comment?.[0] || ''

  mapProperties(properties)

  properties.publishDate = new Date(
    properties?.date?.start_date || value.created_time
  ).getTime()
  properties.publishDay = formatDate(properties.publishDate, BLOG.LANG)
  properties.lastEditedDate = new Date(value?.last_edited_time)
  properties.lastEditedDay = formatDate(
    new Date(value?.last_edited_time),
    BLOG.LANG
  )
  properties.fullWidth = value?.format?.page_full_width ?? false
  properties.pageIcon = mapImgUrl(value?.format?.page_icon, value) ?? ''
  properties.pageCover = mapImgUrl(value?.format?.page_cover, value) ?? ''
  properties.pageCoverThumbnail =
    mapImgUrl(value?.format?.page_cover, value, 'block') ?? ''
  properties.ext = convertToJSON(properties?.ext)
  properties.content = value.content ?? []
  properties.tagItems =
    properties?.tags?.map(tag => {
      return {
        name: tag,
        color: tagOptions?.find(t => t.value === tag)?.color || 'gray'
      }
    }) || []
  delete properties.content
  return properties
}

function convertToJSON(str) {
  if (!str) {
    return {}
  }
  const cleaned = str.replace(/\s/g, '')
  // 如果填的是纯链接，自动包装成 JSON 格式
  if (cleaned.startsWith('http')) {
    return { audio: cleaned }
  }
  try {
    return JSON.parse(cleaned)
  } catch (error) {
    console.warn('无效JSON', str)
    return {}
  }
}

function mapProperties(properties) {
  const typeMap = {
    [BLOG.NOTION_PROPERTY_NAME.type_post]: 'Post',
    [BLOG.NOTION_PROPERTY_NAME.type_page]: 'Page',
    [BLOG.NOTION_PROPERTY_NAME.type_notice]: 'Notice',
    [BLOG.NOTION_PROPERTY_NAME.type_menu]: 'Menu',
    [BLOG.NOTION_PROPERTY_NAME.type_sub_menu]: 'SubMenu',
    [BLOG.NOTION_PROPERTY_NAME.type_member]: 'Member',
    [BLOG.NOTION_PROPERTY_NAME.type_event]: 'Event'
  }

  const statusMap = {
    [BLOG.NOTION_PROPERTY_NAME.status_publish]: 'Published',
    [BLOG.NOTION_PROPERTY_NAME.status_invisible]: 'Invisible'
  }

  if (properties?.type && typeMap[properties.type]) {
    properties.type = typeMap[properties.type]
  }

  if (properties?.status && statusMap[properties.status]) {
    properties.status = statusMap[properties.status]
  }
}

export function adjustPageProperties(properties, NOTION_CONFIG) {
  if (properties.type === 'Post') {
    properties.slug = generateCustomizeSlug(properties, NOTION_CONFIG)
    properties.href = properties.slug ?? properties.id
  } else if (properties.type === 'Page') {
    if (shouldUseMappedCategorySlug(properties, NOTION_CONFIG)) {
      properties.slug = generateCustomizeSlug(properties, NOTION_CONFIG)
    }
    properties.href = properties.slug ?? properties.id
  } else if (properties.type === 'Menu' || properties.type === 'SubMenu') {
    properties.href = properties.slug ?? '#'
    properties.name = properties.title ?? ''
  }

  if (isHttpLink(properties?.href)) {
    properties.href = properties?.slug
    properties.target = '_blank'
  } else if (isMailOrTelLink(properties?.href)) {
    properties.href = properties?.slug
    properties.target = '_self'
  } else {
    properties.target = '_self'
    if (siteConfig('PSEUDO_STATIC', false, NOTION_CONFIG)) {
      if (
        !properties?.href?.endsWith('.html') &&
        properties?.href !== '' &&
        properties?.href !== '#' &&
        properties?.href !== '/'
      ) {
        properties.href += '.html'
      }
    }

    properties.href = convertUrlStartWithOneSlash(properties?.href)
  }

  if (BLOG.NOTION_PAGE_ID.indexOf(',') > 0) {
    const siteIds = BLOG.NOTION_PAGE_ID.split(',')
    for (let index = 0; index < siteIds.length; index++) {
      const siteId = siteIds[index]
      const prefix = extractLangPrefix(siteId)
      if (getLastSegmentFromUrl(properties.href) === prefix) {
        properties.target = '_blank'
      }
    }
  }

  if (!properties.password) {
    properties.password = ''
  } else if (isSHA256Digest(properties.password)) {
    properties.password = properties.password.trim()
  } else if (isMd5Digest(properties.password)) {
    properties.password = properties.password.trim()
  } else {
    properties.password = sha256Digest(properties.password)
  }
}

function shouldUseMappedCategorySlug(properties, NOTION_CONFIG) {
  const allSlugPatterns =
    NOTION_CONFIG?.POST_URL_PREFIX ??
    siteConfig('POST_URL_PREFIX', BLOG.POST_URL_PREFIX, NOTION_CONFIG)
  const categoryMap = siteConfig(
    'POST_URL_PREFIX_MAPPING_CATEGORY',
    {},
    NOTION_CONFIG
  )

  return (
    properties?.type === 'Page' &&
    properties?.category &&
    allSlugPatterns?.includes('%category%') &&
    !!categoryMap?.[properties.category]
  )
}

function generateCustomizeSlug(postProperties, NOTION_CONFIG) {
  if (isHttpLink(postProperties.slug)) {
    return postProperties.slug
  }
  const fullPrefixParts = []
  let allSlugPatterns = NOTION_CONFIG?.POST_URL_PREFIX
  if (allSlugPatterns === undefined || allSlugPatterns === null) {
    allSlugPatterns = siteConfig(
      'POST_URL_PREFIX',
      BLOG.POST_URL_PREFIX,
      NOTION_CONFIG
    ).split('/')
  } else {
    allSlugPatterns = allSlugPatterns.split('/')
  }

  const POST_URL_PREFIX_MAPPING_CATEGORY = siteConfig(
    'POST_URL_PREFIX_MAPPING_CATEGORY',
    {},
    NOTION_CONFIG
  )

  allSlugPatterns.forEach(pattern => {
    if (pattern === '%year%' && postProperties?.publishDay) {
      const formatPostCreatedDate = new Date(postProperties?.publishDay)
      fullPrefixParts.push(String(formatPostCreatedDate.getUTCFullYear()))
    } else if (pattern === '%month%' && postProperties?.publishDay) {
      const formatPostCreatedDate = new Date(postProperties?.publishDay)
      fullPrefixParts.push(
        String(formatPostCreatedDate.getUTCMonth() + 1).padStart(2, 0)
      )
    } else if (pattern === '%day%' && postProperties?.publishDay) {
      const formatPostCreatedDate = new Date(postProperties?.publishDay)
      fullPrefixParts.push(String(formatPostCreatedDate.getUTCDate()).padStart(2, 0))
    } else if (pattern === '%slug%') {
      fullPrefixParts.push(postProperties.slug ?? postProperties.id)
    } else if (pattern === '%category%' && postProperties?.category) {
      let categoryPrefix = postProperties.category
      if (POST_URL_PREFIX_MAPPING_CATEGORY[postProperties?.category]) {
        categoryPrefix =
          POST_URL_PREFIX_MAPPING_CATEGORY[postProperties?.category]
      }
      fullPrefixParts.push(categoryPrefix)
    } else if (!pattern.includes('%')) {
      fullPrefixParts.push(pattern)
    }
  })
  const fullPrefix = fullPrefixParts.filter(Boolean).join('/')

  if (fullPrefix) {
    return `${fullPrefix}/${postProperties.slug ?? postProperties.id}`
  } else {
    return `${postProperties.slug ?? postProperties.id}`
  }
}
