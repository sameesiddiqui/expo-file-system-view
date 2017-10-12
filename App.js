import React from 'react'
import { StyleSheet, View } from 'react-native'
import FileSystemView from './components/file-system-view'

export default class App extends React.Component {
  render () {
    return (
      <View style={styles.container}>
        <FileSystemView />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
