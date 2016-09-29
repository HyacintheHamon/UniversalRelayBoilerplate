/* @flow weak */

import uuid from 'node-uuid'
import winston from 'winston'

export default class PersisterMemory
{
  constructor( )
  {
    this.stores = { }
  }

  getStore( entityName: string )
  {
    if( entityName in this.stores )
      return this.stores[ entityName ]
    else
      return ( this.stores[ entityName ] = [ ] )
  }

  findIndexes( entityName: string, filter: object )
  {
    const store = this.getStore( entityName )
    const arr_Indexes = [ ]

    store.map( ( objectInStore, index ) =>
    {
      let filterMatched = true
      for( let filterField in filter )
        if( objectInStore[ filterField ] != filter[ filterField ] )
        {
          filterMatched = false
          break
        }

      if( filterMatched )
        arr_Indexes.push( index )
    } )

    return arr_Indexes
  }

  findObjects( entityName: string, filter: object )
  {
    const store = this.getStore( entityName )
    const arr_Objects = [ ]

    store.map( ( objectInStore ) =>
    {
      let filterMatched = true
      for( let filterField in filter )
        if( objectInStore[ filterField ] != filter[ filterField ] )
        {
          filterMatched = false
          break
        }

      if( filterMatched )
        arr_Objects.push( objectInStore )
    } )

    return arr_Objects
  }

  getOneObject( entityName: string, ObjectType: any, filters: Array<any> ): Promise
  {
    const arr_Objects = filters.map( filter => this.findObjects( entityName, filter )[ 0 ] )
    return Promise.resolve( arr_Objects )
  }

  getObjectList( entityName: string, ObjectType: any, filters: Array<any> ): Promise
  {
    const arr_arr_Objects = filters.map( filter => this.findObjects( entityName, filter ) )
    return Promise.resolve( arr_arr_Objects )
  }

  add( entityName: string, fields: any, ObjectType: any )
  {
    const store = this.getStore( entityName )
    const newObject = new ObjectType( fields )

    store.push( newObject )

    return Promise.resolve( )
  }

  update( entityName: string, fields: any ): Promise
  {
    // Only use the ID to find the record to delete
    const newFields = { }
    newFields.id = fields.id

    const an_Object = this.findObjects( entityName, newFields )[ 0 ]

    for( let fieldName in fields )
      an_Object[ fieldName ] = fields[ fieldName ]

    return Promise.resolve( )
  }

  remove( entityName: string, fields: any ): Promise
  {
    const store = this.getStore( entityName )

    const indexToDelete = this.findIndexes( entityName, fields )[ 0 ]
    store.splice( indexToDelete, 1 )

    return Promise.resolve( )
  }

  createLogger( )
  {
    return null // No need for logger, by default it will output to console in dev mode
  }

  uuidFromString( str: string ): string
  {
    return str
  }

  uuidRandom( ): string
  {
    return uuid.v1( )
  }

  uuidToString( id: any )
  {
    // ids are always strings anyway
    return id
  }

  uuidEquals( id1: any, id2: any ): boolean
  {
    return id1 == id2
  }

  addTableSchema( tableName: string, tableSchema: object ): void
  {
    // Nothing to do, it's all in memory
  }

  initialize( runAsPartOfSetupDatabase: boolean ): void
  {
    // Nothing to do, it's all in memory
  }
}
