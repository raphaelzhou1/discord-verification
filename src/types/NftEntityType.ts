export type NftAttributeEntityType = {
  display_type?: string
  trait_type: string
  value: string
}

export type NftEntityType = {
  id: string
  name: string
  description: string
  image: string
  token_uri?: string
  extension?: {
    image?: string
    image_data?: string
    external_url?: string
    description?: string
    name?: string
    attributes?: [NftAttributeEntityType]
    background_color?: string
    animation_url?: string
    youtube_url?: string
  }

  collectionAddress: string
  tokenId: string
}
