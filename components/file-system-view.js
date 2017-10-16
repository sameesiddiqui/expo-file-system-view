import React from 'react'
import { FileSystem, Video, Audio } from 'expo'
import VideoPlayer from '@expo/videoplayer'
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  StatusBar
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import TouchableBounce from 'react-native/Libraries/Components/Touchable/TouchableBounce';
let bass = require('../assets/audio/Bass.mp3')

export default class FileSystemView extends React.Component {

  state = {
    folderList: [],
    currentDirectory: 'Home',
    previousDirectory: [],
    header: ['Home'],
    showModal: false,
    modalContent: null
  }

  componentWillMount () {
    this._addTestFiles()
    this._changeDirectory('Home')
  }

  // check the type of the item (folder, pdf, .txt, etc)
  async _resolveItem (currentDirectory, item) {
    let metadata = await FileSystem.getInfoAsync(currentDirectory + item)
    let fileType = item.split('.').pop()

    // file types - each has a unique image and way it will be displayed in _getFileContents
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
        isDirectory: false,
        fileType: 'code'
      }
    } else if (image.has(fileType)) {
      return {
        icon: 'ios-image',
        isDirectory: false,
        fileType: 'image'
      }
    } else if (audio.has(fileType)) {
      return {
        icon: 'ios-volume-up',
        isDirectory: false,
        fileType: 'audio'
      }
    } else if (video.has(fileType)) {
      return {
        icon: 'ios-videocam',
        isDirectory: false,
        fileType: 'video'
      }
    } else {
      return {
        icon: 'md-list-box',
        isDirectory: false,
        fileType: 'text'
      }
    }
  }

  async _getFileContents (path, item, fileType) {
    let { header, previousDirectory } = await this._updateHeader(path, item, false)
    let fileContents = <Text style={styles.text}> This file couldn't be read. See console for details. </Text>

    try {
      if (fileType === 'image') {
        fileContents = <Image source={{uri: path }} style={{alignSelf:'center', width: 300, height: 300}}/>
      } else if (fileType === 'video') {
        // show video file in video player
        fileContents = <VideoPlayer
          videoProps={{
            source: { uri: path },
            rate: 1.0,
            volume: 1.0,
            muted: false,
            resizeMode: Video.RESIZE_MODE_CONTAIN,
            shouldPlay: true,
            isLooping: true,
            style: { width: 300, height: 300 }
          }}
          switchToLandscape={() => {}}
          isPortrait={true}
          playFromPositionMillis={0}
        />
      } else if (fileType === 'audio') {
        fileContents = <Text> Audio is playing! </Text>
        const playbackObject = await Expo.Audio.Sound.create(
          { uri: path },
          { shouldPlay: true }
        )
      } else {
        let stringFileContents = await FileSystem.readAsStringAsync(path)
        fileContents = <Text style={styles.text}> {stringFileContents} </Text>
      }

    } catch (e) {
      console.log('This file couldn\'t be read: ', e)
    }

    this.setState({
      header,
      previousDirectory,
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

    // return indicator if folder is empty
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
      let path = currentDirectory + item
      return (
        <TouchableOpacity
          onPress={() => this._handlePress(path, item, fileInfo[i].isDirectory, fileInfo[i].fileType)}
          key={item}
          style={styles.fileRow}
        >
          <Ionicons
            name={fileInfo[i].icon}
            size={32}
            style={styles.icons} />
          <Text style={{color: '#262626'}}>
            {item}
          </Text>
        </TouchableOpacity>
      )
    })

    return folderList
  }

  _handlePress (path, item, isDirectory, fileType) {
    if (isDirectory) {
      this._changeDirectory(path + '/', item)
    } else {
      this._getFileContents(path, item, fileType)
    }
  }

  _updateHeader (newDirectory, item, isDirectory = true) {
    if (isDirectory) {
      item += '/'
    }
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

  // display contents of the selected directory path
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

  // TODO: download a file, add pic from camera roll, create folder
  _addFile () {
    let modalContent = <Text> Hello World </Text>
    this.setState({
      showModal: true,
      modalContent
    })
  }

  render () {
    // don't render back button before picking a directory
    let backButton = null
    let addButton = null
    if (this.state.currentDirectory !== 'Home') {
      backButton = (
        <TouchableOpacity onPress={() => this._goToPrevDirectory()} >
          <Ionicons
            name={'ios-arrow-round-back'}
            size={32}
            style={styles.backButton} />
        </TouchableOpacity>
      )
      addButton = (
        <TouchableBounce
          onPress={() => this._addFile()}
          style={styles.addButtonContainer}>
          <Ionicons
            name={'ios-add-outline'}
            size={35}
            style={styles.addButton} />
        </TouchableBounce>
      )
    }

    let modal = (
      <Modal
        animationType='slide'
        transparent={false}
        visible={this.state.showModal}
        onRequestClose={() => {alert("Modal has been closed.")}}
      >
        <View>
          {this.state.modalContent}
          <TouchableOpacity
            onPress={() => this.setState({showModal: false})}
            >
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    )

    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <View style={styles.header}>
          {backButton}
          <Text style={styles.headerText}>
            {this.state.header.join('')}
          </Text>
        </View>

        {this.state.folderList}
        {modal}
        <View style={styles.footer}>
          {addButton}
        </View>

      </View>
    )
  }

  // optional add in if first time running the app. generates some files.
  _addTestFiles () {
    let options = {
      intermediates: true
    }
    let example = {
      this_worked: 'yes',
      expo_is_cool: true
    }
    let passwords = {
      trolled: true
    }
    try {
      FileSystem.deleteAsync(FileSystem.documentDirectory)
      FileSystem.deleteAsync(FileSystem.cacheDirectory)

      FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'cool_folder/secret', options)
      FileSystem.writeAsStringAsync(FileSystem.documentDirectory + 'example.json', JSON.stringify(example, null, '\t'))
      FileSystem.makeDirectoryAsync(FileSystem.cacheDirectory + 'cache_money', options)
      FileSystem.writeAsStringAsync(FileSystem.documentDirectory + 'cool_folder/secret/passwords.json', JSON.stringify(passwords, null, '\t'))

      FileSystem.downloadAsync(
        'http://pngimg.com/uploads/cat/cat_PNG1631.png',
        FileSystem.documentDirectory + 'cat.png'
      )
      FileSystem.downloadAsync(
        'http://techslides.com/demos/sample-videos/small.mp4',
        FileSystem.documentDirectory + 'small.mp4'
      )
      FileSystem.downloadAsync(
        'http://pngimg.com/uploads/falling_money/falling_money_PNG15438.png',
        FileSystem.cacheDirectory + 'cache_money/wealth_creation.png'
      )

      // FileSystem.getInfoAsync(FileSystem.documentDirectory).then((info) => console.log(info))
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
    backgroundColor: '#f7f7f7',
    flex: 1,
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
    alignSelf: 'center',
    justifyContent: 'flex-start'
  },
  addButtonContainer: {
    backgroundColor: '#2188FF',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    margin: 15,
    justifyContent: 'center',
    alignSelf: 'flex-end'
  },
  addButton:{
    color: '#F8F8F9',
    alignSelf: 'center'
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
    color: '#262626',
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
  footer: {
    // borderWidth: 1,
    // borderColor: '#000',
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: 0,
    right: 0
  }
})
