import React from 'react'
import { FileSystem } from 'expo'
import { Text } from 'react-native'

export default class FileSystemView extends React.Component {
  constructor () {
    super()
    this.documentDirectory = null
    this.cacheDirectory = null
  }

  componentWillMount () {
    console.log(FileSystem.documentDirectory)
    FileSystem.readDirectoryAsync(FileSystem.documentDirectory)
    .then((info) => {
      console.log(info)
      this.documentDirectory = info
    })
    .catch((error) => {
      console.error(error)
    })

    FileSystem.readDirectoryAsync(FileSystem.cacheDirectory)
    .then((info) => {
      console.log(info)
      this.cacheDirectory = info
    })
    .catch((error) => {
      console.error(error)
    })

        // FileSystem.readAsStringAsync(
        //   FileSystem.documentDirectory + 'RCTAsyncLocalStorage/manifest.json'
        // )
        // .then((info) => {
        //   console.log('contents: ', info)
        // })
  }

  render () {
    return (
      <Text>
        Storage
        {this.documentDirectory}
        Cache
        {this.cacheDirectory}
      </Text>
    )
  }
}
