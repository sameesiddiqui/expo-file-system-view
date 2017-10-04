import React from 'react'
import { FileSystem } from 'expo'
import { TouchableOpacity, View, Text } from 'react-native'

export default class FileSystemView extends React.Component {

  state = {
    folderList: [],
    currentDirectory: '/',
    previousDirectory: null
  }

  constructor () {
    super()
    this._changeDirectory = this._changeDirectory.bind(this)
    this._getFolderContents = this._getFolderContents.bind(this)
  }

  componentWillMount () {
    // this._addTestFiles()
    
    // show the folders that expo has read/write access to
    if (this.state.currentDirectory === '/') {
      folderList = []
      folderList.push(
        <TouchableOpacity
          onPress={() => this._changeDirectory(FileSystem.documentDirectory)}
          key={'documentDirectory'}
        >
          <Text>
            documentDirectory/
          </Text>
        </TouchableOpacity>
      )
      folderList.push(
        <TouchableOpacity
          onPress={() => this._changeDirectory(FileSystem.cacheDirectory)}
          key={'cacheDirectory'}
        >
          <Text>
            cacheDirectory/
          </Text>
        </TouchableOpacity>
      )
    }

    this.setState({
      folderList: folderList
    })
  }

  async _getFolderContents (currentDirectory) {
    let contents = await FileSystem.readDirectoryAsync(currentDirectory)
    console.log('contents: ', contents)
    let folderList = await contents.map((folder) => {
      // TODO: check if item is file or folder, don't append ending slash and change image
      // possible images: folder, image, other (.json, etc, use </>)
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
    // console.log('state: ', this.state)
    return (
      <View>
        {this.state.folderList}
      </View>
    )
  }

  _addTestFiles () {
    let options = {
      intermediates: true
    }
    try {
      FileSystem.deleteAsync(FileSystem.documentDirectory)
      FileSystem.deleteAsync(FileSystem.cacheDirectory)
      FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'hello_world/inner', options)
      FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'hello_world/another_one', options)
      FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'hi_folder/grass', options)
      FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'hi_folder/butter/milk', options)
      FileSystem.makeDirectoryAsync(FileSystem.cacheDirectory + 'cache_me_outside/how_bow_dah', options)
      FileSystem.makeDirectoryAsync(FileSystem.cacheDirectory + 'cache_money', options)
    } catch (error) {
      console.log(error)
    }
  }
}
