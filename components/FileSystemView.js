import React from 'react'
import { FileSystem } from 'expo'
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default class FileSystemView extends React.Component {

  state = {
    folderList: [],
    currentDirectory: 'Home',
    previousDirectory: [],
    header: ['Home']
  }

  constructor () {
    super()
    this._changeDirectory = this._changeDirectory.bind(this)
    this._getFolderContents = this._getFolderContents.bind(this)
    this._resolveItem = this._resolveItem.bind(this)
  }

  componentWillMount () {
    this._addTestFiles()
    this._changeDirectory('Home')
  }

  // check the type of the item (folder, pdf, .txt, etc)
  async _resolveItem (currentDirectory, item) {
    let metadata = await FileSystem.getInfoAsync(currentDirectory + item)
    let fileType = item.split('.').pop()
    console.log(item + ': ' + fileType)
    let code = new Set(['js', 'json', 'css', 'html'])
    let image = new Set(['jpg', 'png', 'ico', 'svg', 'pdf'])
    let audio = new Set(['mp3'])
    let video = new Set(['mp4'])
    if (metadata.isDirectory) {
      return {
        icon: 'ios-folder',
        isDirectory: true
      }
    } else if (code.has(fileType)) {
      return {
        icon: 'ios-code',
        isDirectory: false
      }
    } else if (image.has(fileType)) {
      return {
        icon: 'ios-image',
        isDirectory: false
      }
    } else if (audio.has(fileType)) {
      return {
        icon: 'ios-volume-up',
        isDirectory: false
      }
    } else if (video.has(fileType)) {
      return {
        icon: 'ios-videocam',
        isDirectory: false
      }
    } else {
      return {
        icon: 'ios-document',
        isDirectory: false
      }
    }
  }

  async _getFileContents (path, item) {
    console.log('This is a file!')
    let fileContents = await FileSystem.readAsStringAsync(path)
    this.setState({
      folderList: fileContents
    })
  }

  async _getFolderContents (currentDirectory) {
    // return virtual home directory that has both document and cache storage
    if (currentDirectory === 'Home') {
      return ([
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
        </TouchableOpacity>,
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
      ])
    }

    let contents = await FileSystem.readDirectoryAsync(currentDirectory)

    // return indicator is folder is empty
    if (contents.length === 0) {
      return (
        <View style={styles.textContainer}>
          <Text
            style={styles.text} >
            This directory is empty!
          </Text>
        </View>
      )
    }

    // get item metadata to decide icon
    let contentsPromises = contents.map(async (item) => {
      let info = await this._resolveItem(currentDirectory, item)
      return info
    })
    let fileInfo = await Promise.all(contentsPromises)

    let folderList = contents.map((item, i) => {
      let path = currentDirectory + item + '/'
      return (
        <TouchableOpacity
          onPress={() => this._handlePress(path, item, fileInfo[i].isDirectory)}
          key={item}
          style={styles.fileRow}
        >
          <Ionicons
            name={fileInfo[i].icon}
            size={32}
            style={styles.icons} />
          <Text>
            {item}
          </Text>
        </TouchableOpacity>
      )
    })
    // console.log(folderList)
    return folderList
  }

  _handlePress (path, item, isDirectory) {
    if (isDirectory) {
      this._changeDirectory(path, item)
    } else {
      this._getFileContents(path, item)
    }
  }

  _updateHeader (newDirectory, item) {
    item += '/'
    let header = this.state.header
    let previousDirectory = this.state.previousDirectory

    // going to previousDirectory
    if (item === '/') {
      if (header.length > 1) {
        header.pop()
      } else {
        // Went all the way up to home
        header[0] = 'Home'
      }
    } // check if we've picked a directory yet
    else if (item === 'documentDirectory/' || item === 'cacheDirectory/') {
      header[0] = item
      previousDirectory.push('Home')
    } else {
      header.push(item)
      previousDirectory.push(this.state.currentDirectory)
    }

    return {
      header,
      previousDirectory
    }
  }

  async _changeDirectory (newDirectory, item = '') {

    let { header, previousDirectory } = this._updateHeader(newDirectory, item)
    let folderList = await this._getFolderContents(newDirectory)

    this.setState({
      folderList,
      currentDirectory: newDirectory,
      previousDirectory,
      header
    })
  }

  _goToPrevDirectory () {
    let previousDirectory = this.state.previousDirectory
    previousDirectory = previousDirectory.pop()

    if (previousDirectory === 'Home' || previousDirectory === null) {
      // don't go to a directory, go to home view
      this._changeDirectory('Home')
    } else {
      this._changeDirectory(previousDirectory)
    }
  }

  render () {
    // don't render back button before picking a directory
    let backButton = null
    if (this.state.currentDirectory !== 'Home') {
      backButton = (
        <TouchableOpacity
          onPress={() => this._goToPrevDirectory()}
          style={styles.buttonContainer}
          >
            <Ionicons
              name={'ios-arrow-round-back'}
              size={32}
              style={styles.backButton} />
          </TouchableOpacity>
      )
    }

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          {backButton}
          <Text style={styles.headerText}>
            {this.state.header.join('')}
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
    // justifyContent: 'center',
    height: 56,
    backgroundColor: '#2188FF',
  },
  backButton: {
    // borderWidth: 1,
    // borderColor: '#000',
    color: '#F8F8F9',
    width: 32,
    marginLeft: 15,
    justifyContent: 'flex-start'
  },
  headerText: {
    // borderWidth: 1,
    // borderColor: '#000',
    color: '#F8F8F9',
    alignItems: 'center',
    flex: 1,
    marginLeft: 15,
    // height: 32,
    fontSize: 16
  },
  icons: {
    // borderWidth: 1,
    // borderColor: '#000',
    color: '#2188FF',
    margin: 15,
    width: 32
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center'
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
