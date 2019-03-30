import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AsyncStorage
} from 'react-native';
import { Input } from 'react-native-elements';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Ajustes',
  };
  constructor(props){
    super(props)

    this.state = {
      fname: null,
      lname: null,
      age: null,
      gender: null
    }

    this.handleFnameChange = this.handleFnameChange.bind(this)
    this.handleLnameChange = this.handleLnameChange.bind(this)
    this.handleAgeChange = this.handleAgeChange.bind(this)
    this.handleGenderChange = this.handleGenderChange.bind(this)
  }

  async componentWillMount(){
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    console.log(user)
    this.setState({fname: user.fname, lname: user.lname, age: user.age, gender: user.gender })
  }

  handleFnameChange(fname){
    this.setState({fname})
  }
  handleLnameChange(lname){
    this.setState({lname})
  }
  handleAgeChange(age){
    this.setState({age})
  }
  handleGenderChange(gender){
    this.setState({gender})
  }

  render() {
    console.log('thisstate', this.state)
    const { fname, lname, age, gender } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/girllap.png')
                  : require('../assets/images/girllap.png')
              }
              style={styles.welcomeImage}
            />
          </View>
          <View style={styles.getStartedContainer}>
            <Text style={styles.mainStartedText}>Vigilante</Text>
            <Text style={styles.getStartedText}>Ingresa tus datos personales para mantener actualizada nuestra base y poder ayudarte en todo momento.</Text>

            <Input
              label="Nombre"
              name="fname"
              placeholder={fname}
              onChangeText={this.handleFnameChange}
            />
            <Input
              label="Apellido"
              name="lname"
              placeholder={lname}
              onChangeText={this.handleLnameChange}
            />
            <Input
              label="Edad"
              name="age"
              placeholder={age}
              onChangeText={this.handleAgeChange}
            />
            <Input
              label="Genero"
              name="gender"
              placeholder={gender}
              onChangeText={this.handleGenderChange}
            />
          </View>
          { fname || lname || age || gender ?
            <View style={styles.tabBarInfoContainer}>
              <TouchableOpacity 
                style={{paddingHorizontal: 20, paddingVertical: 20, borderRadius: 5, backgroundColor: '#e9ecfd'}}
                onPress={() => {
                  AsyncStorage.setItem('user', JSON.stringify(this.state))
                  alert('Información Guardada')
                }}
              >
                <Text style={{color: '#464d84'}}>Guarda</Text>
              </TouchableOpacity>
            </View>
          : null}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 150,
    height: 100,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  mainStartedText: {
    fontSize: 18,
    color: 'rgb(70, 74, 81)',
    lineHeight: 24,
    fontWeight: '400',
    textAlign: 'center',
  },
  getStartedText: {
    fontSize: 16,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
