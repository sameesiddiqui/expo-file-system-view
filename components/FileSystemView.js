import React from 'react'
import { FileSystem } from 'expo'
import { View, Text } from 'react-native'

export default class FileSystemView extends React.Component {
  state = {}

  async componentWillMount () {
    try {
      let documentDirectory = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory)
      let cacheDirectory = await FileSystem.readDirectoryAsync(FileSystem.cacheDirectory)
      console.log('document: ', documentDirectory)
      console.log('cache: ', cacheDirectory)
      await this.setState({
        documentDirectory,
        cacheDirectory
      })
    } catch (error) {
      console.log(error)
    }
  }

  render () {
    console.log('state: ', this.state)
    return (
      <View>
        <Text>
          Storage: {this.state.documentDirectory}
        </Text>
        <Text>
          Cache: {this.state.cacheDirectory}
        </Text>
      </View>
    )
  }
}
