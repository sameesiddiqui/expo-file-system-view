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
    this._resolveItem = this._resolveItem.bind(this)
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

  async _resolveItem (currentDirectory, item) {
    let metadata = await FileSystem.getInfoAsync(currentDirectory + item)
    if (metadata.isDirectory) {
      return {
        icon: 'ios-folder',
        isDirectory: true
      }
    } else {
      return {
        icon: 'ios-code',
        isDirectory: false
      }
    }
  }

  async _getFileContents (currentDirectory, file) {
    console.log('This is a file!')
  }

  async _getFolderContents (currentDirectory) {
    let contents = await FileSystem.readDirectoryAsync(currentDirectory)

    // check if item is a folder or file
    let contentsPromises = contents.map(async (item) => {
      let info = await this._resolveItem(currentDirectory, item)
      return info
    })
    let fileInfo = await Promise.all(contentsPromises)

    let folderList = contents.map((item, i) => {
      return (
        <TouchableOpacity
          onPress={() => this._changeDirectory(currentDirectory, item, fileInfo[i].isDirectory)}
          key={item}
          style={styles.fileRow}
        >
          <Ionicons
            name={fileInfo[i].icon}
            size={32}
            style={styles.icons} />
          <Text
            style={styles.text} >
            {item}
          </Text>
        </TouchableOpacity>
      )
    })
    // console.log(folderList)
    return folderList
  }

  async _changeDirectory (currentDirectory, folder, isDirectory = true) {
    folder += '/'
    let header = this.state.header
    // add the folder to our navigation stack
    let previousDirectory = this.state.previousDirectory
    previousDirectory.push(folder)
    // check if we've picked a directory yet
    if (folder === 'documentDirectory/' || folder === 'cacheDirectory/') {
      header = folder
      folder = ''
    } else {
      header += folder
    }
    let folderList = await this._getFolderContents(currentDirectory + folder)

    this.setState({
      folderList,
      currentDirectory,
      previousDirectory,
      header
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
      // FileSystem.deleteAsync(FileSystem.documentDirectory)
      // FileSystem.deleteAsync(FileSystem.cacheDirectory)
      // FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'hello_world/inner', options)
      // FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'hello_world/another_one', options)
      // FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'hi_folder/grass', options)
      // FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'hi_folder/butter/milk', options)
      // FileSystem.makeDirectoryAsync(FileSystem.cacheDirectory + 'cache_me_outside/how_bow_dah', options)
      // FileSystem.makeDirectoryAsync(FileSystem.cacheDirectory + 'cache_money', options)
      // FileSystem.makeDirectoryAsync(FileSystem.cacheDirectory + 'play_dot_cache/go_to_the_site', options)
      // FileSystem.writeAsStringAsync('hi_folder/grass/file.json', '{ this_worked: \'yes\' }')
      // FileSystem.getInfoAsync(FileSystem.cacheDirectory + 'ExponentAsset-74c652671225d6ded874a648502e5f0a.ttf').then((info) => console.log(info))
      // FileSystem.getInfoAsync(FileSystem.cacheDirectory + 'ExponentAsset-74c652671225d6ded874a648502e5f0a.ttf/').then((info) => console.log(info))
      // FileSystem.getInfoAsync(FileSystem.cacheDirectory + 'cache_money/').then((info) => console.log(info))
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
