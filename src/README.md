# expo-file-system-view
Drop-in component for viewing your expo app file system.
---
`npm install expo-file-system-view`

## Simple use case
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
