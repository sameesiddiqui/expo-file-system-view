import React from 'react'
import { FileSystem } from 'expo'
import { TouchableOpacity, View, Text } from 'react-native'

export default class Folder extends React.Component {
  state = {}

  async componentWillMount () {
    let currentDirectory = this.props.path
    let contents = await FileSystem.readDirectoryAsync(currentDirectory)
    console.log('contents: ', contents)
    let folderList = await contents.map((folder) => {
      return (
        <TouchableOpacity
          key={folder}
        >
          <Text>
            {folder}
          </Text>
        </TouchableOpacity>
      )
    })
    console.log('folderList: ', folderList)
    this.setState({
      folderList
    })
  }

  render () {
    return (
      <View>
        {this.state.folderList}
      </View>
    )
  }
}
