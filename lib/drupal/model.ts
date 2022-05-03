export interface Self {
  href: string
}

export interface Link {
  self: Self
}

export interface Meta {
  links: Link
}

export interface Jsonapi {
  version: string
  meta: Meta
}

export interface Self {
  href: string
}

export interface Link {
  self: Self
}

export interface Path {
  alias: string
  pid: number
  langcode: string
}

export interface Body {
  value: string
  format: string
  processed: string
  summary: string
}

export interface Comment {
  status: number
  cid: number
  last_comment_timestamp: number
  last_comment_name?: any
  last_comment_uid: number
  comment_count: number
}

export interface Attribute {
  drupal_internal__nid: number
  drupal_internal__vid: number
  langcode: string
  revision_timestamp: string
  revision_log?: any
  status: boolean
  title: string
  created: string
  changed: string
  promote: boolean
  sticky: boolean
  default_langcode: boolean
  revision_translation_affected: boolean
  path: Path
  body: Body
  comment: Comment
}

export interface Data {
  type: string
  id: string
  meta: Meta
}

export interface Related {
  href: string
}

export interface Self {
  href: string
}

export interface Link {
  related: Related
  self: Self
}

export interface Node_type {
  data: Data
  links: Link
}

export interface Meta {
  drupal_internal__target_id: string
}

export interface Data {
  type: string
  id: string
  meta: Meta
}

export interface Related {
  href: string
}

export interface Self {
  href: string
}

export interface Link {
  related: Related
  self: Self
}

export interface Revision_uid {
  data: Data
  links: Link
}

export interface Data {
  type: string
  id: string
  meta: Meta
}

export interface Related {
  href: string
}

export interface Self {
  href: string
}

export interface Link {
  related: Related
  self: Self
}

export interface Uid {
  data: Data
  links: Link
}

export interface Related {
  href: string
}

export interface Self {
  href: string
}

export interface Link {
  related: Related
  self: Self
}

export interface Field_image {
  data?: any
  links: Link
}

export interface Related {
  href: string
}

export interface Self {
  href: string
}

export interface Link {
  related: Related
  self: Self
}

export interface Field_tag {
  data: any[]
  links: Link
}

export interface Relationship {
  node_type: Node_type
  revision_uid: Revision_uid
  uid: Uid
  field_image: Field_image
  field_tags: Field_tag
}

export interface Data {
  type: string
  id: string
  links: Link
  attributes: Attribute
  relationships: Relationship
}

export interface Self {
  href: string
}

export interface Link {
  self: Self
}

export interface DrupalArticlesModel {
  jsonapi: Jsonapi
  data: Data[]
  links: Link
}
