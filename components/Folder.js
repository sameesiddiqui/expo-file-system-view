import React from 'react'
import { FileSystem } from 'expo'
import { TouchableOpacity, View, Text } from 'react-native'

export default class Folder extends React.Component {
  state = {
    folderList: [],
    currentDirectory: '/'
  }

  constructor () {
    super()
    this._changeDirectory = this._changeDirectory.bind(this)
  }

  async componentWillMount () {
    let currentDirectory = this.props.path
    let contents = await FileSystem.readDirectoryAsync(currentDirectory)
    console.log('contents: ', contents)
    let folderList = await contents.map((folder) => {
      return (
        <TouchableOpacity
          onPress={this._changeDirectory(currentDirectory + folder + '/')}
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

  _changeDirectory (newDirectory) {
    console.log('clicked!')
    this.setState({
      currentDirectory: newDirectory
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
