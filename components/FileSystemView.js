import React from 'react'
import { FileSystem } from 'expo'
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default class FileSystemView extends React.Component {

  state = {
    folderList: [],
    currentDirectory: '/',
    previousDirectory: [],
    header: 'Home'
  }

  constructor () {
    super()
    this._changeDirectory = this._changeDirectory.bind(this)
    this._getFolderContents = this._getFolderContents.bind(this)
  }

  componentWillMount () {
    this._addTestFiles()

    // show the folders that expo has read/write access to
    if (this.state.currentDirectory === '/') {
      folderList = []
      folderList.push(
        <TouchableOpacity
          onPress={() => this._changeDirectory(FileSystem.documentDirectory, 'documentDirectory')}
          key={'documentDirectory'}
          style={styles.fileRow}
        >
          <Ionicons
            name="ios-folder"
            size={32}
            style={styles.icons}
          />
          <Text>
            documentDirectory/
          </Text>
        </TouchableOpacity>
      )
      folderList.push(
        <TouchableOpacity
          onPress={() => this._changeDirectory(FileSystem.cacheDirectory, 'cacheDirectory')}
          key={'cacheDirectory'}
          style={styles.fileRow}
        >
          <Ionicons
            name="ios-folder"
            size={32}
            style={styles.icons}
          />
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
          onPress={() => this._changeDirectory(currentDirectory, folder)}
          key={folder}
          style={styles.fileRow}
        >
          <Ionicons
            name="ios-folder"
            size={32}
            style={styles.icons} />
          <Text
            style={styles.text} >
            {folder}
          </Text>
        </TouchableOpacity>
      )
    })
    return folderList
  }

  async _changeDirectory (newDirectory, folder) {
    folder += '/'
    let header = this.state.header
    // check if we've picked a directory yet
    if (folder === 'documentDirectory/' || folder === 'cacheDirectory/') {
      header = folder
      folder = ''
    } else {
      header += folder
    }
    let folderList = await this._getFolderContents(newDirectory + folder)

    this.setState({
      folderList: folderList,
      currentDirectory: newDirectory,
      header: header
    })
  }

  render () {
    // console.log('state: ', this.state)
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            {this.state.header}
          </Text>
        </View>
        {this.state.folderList}
      </View>
    )
  }

  // optional add in if first time running the app. generates some files.
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
      FileSystem.makeDirectoryAsync(FileSystem.cacheDirectory + 'play_dot_cache/go_to_the_site', options)
    } catch (error) {
      console.log(error)
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    // borderWidth: 1,
    // borderColor: '#000',
    flex: .9,
    alignSelf: 'stretch'
  },
  header: {
    // borderWidth: 1,
    // borderColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#2188FF',
  },
  headerText: {
    color: '#F8F8F9',
    fontSize: 16
  },
  icons: {
    color: '#2188FF',
    margin: 15
  },
  fileRow: {
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'flex-start'
  },
})
