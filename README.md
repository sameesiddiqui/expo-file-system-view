# expo-file-system-view
Drop-in component for viewing your expo app file system.

Code for component is under `src/`

Clone the repo to play around with the component in a simple app.

## Install
`npm install expo-file-system-view`

## Simple use case
Drop it anywhere in your own app:
```javascript
import React from 'react'
import { View } from 'react-native'
import FileSystemView from 'expo-file-system-view'

export default class App extends React.Component {
  render () {
    return (
      <View>
        <FileSystemView />
      </View>
    )
  }
}
```
