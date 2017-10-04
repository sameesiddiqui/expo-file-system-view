import React from 'react'
import { FileSystem } from 'expo'
import { TouchableOpacity, View, Text } from 'react-native'
import Folder from './Folder'

export default class FileSystemView extends React.Component {
  state = {
    currentDirectory: '/'
  }

  async componentWillMount () {
    try {
      // FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'hello_world')
      // FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'hello_world/inner')
      // FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'hello_world/another_one')
      // FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'hi_folder/butter')
      // FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'hi_folder/grass')
      // FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'hi_folder/butter/milk')
      // FileSystem.makeDirectoryAsync(FileSystem.cacheDirectory + 'hello_world_cache')
      // FileSystem.makeDirectoryAsync(FileSystem.cacheDirectory + 'cache_money')
      let documentDirectory = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory)
      let cacheDirectory = await FileSystem.readDirectoryAsync(FileSystem.cacheDirectory)
      // console.log('document: ', documentDirectory)
      // console.log('cache: ', cacheDirectory)
      await this.setState({
        documentDirectory,
        cacheDirectory
      })
    } catch (error) {
      console.log(error)
    }
  }

  render () {
    // console.log('state: ', this.state)
    return (
      <View>
        <Folder
          path={FileSystem.documentDirectory}
         />
      </View>
    )
  }
}
