import React from 'react';
import { View, Text, FlatList, ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { ListItem, SearchBar } from 'react-native-elements';
import { Contacts } from 'expo';

export default class ContactsScreen extends React.Component {
  static navigationOptions = {
    title: 'Contactos',
  };

  state = {
    contacts: null,
    data: [],
    loading: false,
    error: null,
    selectedContacts: []
  }

  arrayholder = [];

  async componentWillMount(){
    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers],
    });
    data.map(data => data.isSelected = false)
    if (data.length > 0) {
      this.setState({contacts: data});
    }
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '86%',
          backgroundColor: '#CED0CE',
          marginLeft: '14%',
        }}
      />
    );
  };

  searchFilterFunction = text => {
    this.setState({
      value: text,
    });

    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.name.title.toUpperCase()}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      data: newData,
    });
  };

  renderHeader = () => {
    return (
      <SearchBar
        placeholder="Buscar..."
        lightTheme
        round
        onChangeText={text => this.searchFilterFunction(text)}
        autoCorrect={false}
        value={this.state.value}
      />
    );
  };

  // Modify
  selectItem = item => {
    const { data, selectedContacts } = this.state;
    item.isSelected = !item.isSelected;
  
    const index = data.findIndex(item => item.id === item.id);
    selectedContacts.push(item);
    data[index] = item;
    this.setState({data, selectedContacts});
  };

  renderItem = item =>
    <TouchableOpacity onPress={() => this.selectItem(item)}>
      <ListItem
        leftAvatar={{ source: { uri: '../assets/images/robot-dev.png' } }}
        title={`${item.firstName} ${item.lastName}`}
        subtitle={item.jobTitle}
        style={item.selectedClass}
      />
    </TouchableOpacity>

  render() {
    const { contacts, loading, selectedContacts } = this.state;

    if (loading) {
      return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator />
          </View>
        );
      }
      return (
        <>
        <View style={{ flex: 1 }}>
          <FlatList
            data={contacts}
            renderItem={({ item }) => this.renderItem(item)}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={this.renderSeparator}
            ListHeaderComponent={this.renderHeader}
          />
        </View>
        { selectedContacts.length > 0 ?
          <View style={styles.tabBarInfoContainer}>
            <TouchableOpacity 
              style={{paddingHorizontal: 20, paddingVertical: 20, borderRadius: 5, backgroundColor: '#e9ecfd'}}
            >
              <Text style={{color: '#464d84'}}>Avísa a {selectedContacts.map(c => c.firstName + " ")}</Text>
            </TouchableOpacity>
          </View>
          : null}
        </>
      );
    }
  };



const styles = StyleSheet.create({
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
})