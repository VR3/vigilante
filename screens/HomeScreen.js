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
import { Location, Permissions } from 'expo';
import * as firebase from 'firebase';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  timeout = 0

  constructor(props){
    super(props);
    this.state = {
      location: null,
    }
    this.guidGenerator = this.guidGenerator.bind(this);
  }

  async componentWillMount(){
    
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
  }

  guidGenerator() {
    var S4 = () => {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  }


  async handleReportSend(){
    let location = await Location.getCurrentPositionAsync({});
    var S4 = () => {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };

    const user = JSON.parse(await AsyncStorage.getItem('user'));
    const id = S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4()
    await firebase.database().ref('reports/' + id).set({
      id,
      fname: user.fname,
      lname: user.lname,
      age: user.age,
      gender: user.gender,
      date: Date(),
      lat: location.coords.latitude,
      long: location.coords.longitude,
    })
  }

  render() {
    const { location } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/girl.png')
                  : require('../assets/images/girl.png')
              }
              style={styles.welcomeImage}
            />
          </View>
          <View style={styles.getStartedContainer}>
            <Text style={styles.mainStartedText}>Vigilante</Text>
            <Text style={styles.getStartedText}>Utiliza Vigilante para denunciar una situación incómoda en tu trabajo, escuela, casa o camino.</Text>
          </View>

        </ScrollView>

        { location ?
          <View style={styles.tabBarInfoContainer}>
            <TouchableOpacity
              style={{paddingHorizontal: 20, paddingVertical: 20, borderRadius: 5, backgroundColor: '#e9ecfd'}}
              onLongPress={() => {
                this.handleReportSend()
                alert('Reporte Enviado')
              }}
            >
              <Text style={{color: '#464d84'}}>Denuncia aquí</Text>
            </TouchableOpacity>
          </View>
        : null}
      </View>
    );
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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
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
