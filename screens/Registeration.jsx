import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import Form from '../Components/Form'

const Registeration = () => {
  return (
<View style={styles.container}>
    <Text style={styles.formHeader}>get in touch</Text>
    <Form/>

</View>
  )
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#3795BD',

    },
    formHeader:{
        color:'white',
        marginBottom:30,
        fontSize:36,
        fontWeight:'700',
        textTransform:'capitalize'


    }
})


export default Registeration
