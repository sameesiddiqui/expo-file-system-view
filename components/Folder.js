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
    this._getFolderContents = this._getFolderContents.bind(this)
  }

  //TODO: show cache and storage directories on mounting
  async componentWillMount () {
    let currentDirectory = this.props.path
    let folderList = await this._getFolderContents(currentDirectory)
    this.setState({
      folderList: folderList
    })
  }

  async _getFolderContents (currentDirectory) {
    let contents = await FileSystem.readDirectoryAsync(currentDirectory)
    console.log('contents: ', contents)
    let folderList = await contents.map((folder) => {
      return (
        <TouchableOpacity
          onPress={() => this._changeDirectory(currentDirectory + folder + '/')}
          key={folder}
        >
          <Text>
            {folder}
          </Text>
        </TouchableOpacity>
      )
    })
    console.log('folderList: ', folderList)
    return folderList
  }

  async _changeDirectory (newDirectory) {
    let folderList = await this._getFolderContents(newDirectory)
    this.setState({
      folderList: folderList,
      currentDirectory: newDirectory
    })
  }

  render () {
    console.log(this.state.currentDirectory)
    return (
      <View>
        {this.state.folderList}
      </View>
    )
  }
}
