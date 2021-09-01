import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import axios from 'axios';
import {POKEAPI_URL, POKEIMAGE_URL} from './utils/Constants';
import PokemonCard from './components/PokemonCard';

const Dashboard = () => {
  const [pokemonName, setPokemonName] = useState('');
  const [pokemonList, setPokemonList] = useState([]);
  const inputReference = useRef<typeof TextInput>();
  const createTwoButtonAlert = (title: string, message: string) =>
    Alert.alert(title, message, [
      {text: 'Got it!', onPress: () => setPokemonName('')},
    ]);

  const fetchPokemonByName = async () => {
    if (pokemonName.length > 3) {
      await axios
        .get(POKEAPI_URL, {params: {limit: 1118}})
        .then(async response => {
          if (response.data.results && response.data.results.length > 0) {
            const catchedPokemon = response.data.results.filter(pokemon => {
              return pokemon.name.toUpperCase() === pokemonName.toUpperCase();
            });
            if (catchedPokemon.length > 0 && catchedPokemon[0].url) {
              await axios.get(catchedPokemon[0].url).then(responsePokemon => {
                const list = pokemonList.slice();
                const exist = list.find(
                  item => pokemonName.toUpperCase() === item.name.toUpperCase(),
                );
                if (exist){
                  createTwoButtonAlert(
                    'Duplicated',
                    `Pokemon ${pokemonName} already exist.`,
                  );
                } else {
                  list.push({
                    name: responsePokemon.data.name,
                    id: responsePokemon.data.id,
                    image: `${POKEIMAGE_URL}${responsePokemon.data.id}.png`,
                  });
                  setPokemonList(list);
                  setPokemonName('');
                  inputReference.current.blur();
                }
              });
            } else {
              createTwoButtonAlert(
                'Ops... no luck?',
                `Pokemon ${pokemonName} not found.`,
              );
            }
          }
        });
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaStyle}>
      <View style={styles.headerContainer}>
        <Text style={styles.textTitleStyle}>
          Are you ready to catch your Pokemon?
        </Text>
        <TextInput
          ref={inputReference}
          style={styles.textInputStyle}
          mode="outlined"
          label=" POKEMON NAME "
          value={pokemonName}
          onChangeText={text => setPokemonName(text)}
        />
        <TouchableOpacity
          onPress={() => {
            fetchPokemonByName();
          }}
          style={[
            pokemonName.length > 3
              ? styles.touchableOpacityEnableStyle
              : styles.touchableOpacityStyle,
          ]}
          disabled={pokemonName.length > 3 ? false : true}>
          <Text
            style={[
              pokemonName.length > 3
                ? styles.textButtonEnableStyle
                : styles.textButtonStyle,
            ]}>
            start catching your poke
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={styles.textTitleStyle}>Your collection</Text>
        {pokemonList && pokemonList.length > 0 ? (
          <FlatList
            contentContainerStyle={{alignItems: 'center'}}
            numColumns={2}
            data={pokemonList}
            keyExtractor={item => item.id}
            renderItem={({item}) => {
              return (
                <PokemonCard id={item.id} name={item.name} image={item.image} />
              );
            }}
          />
        ) : (
          <Text> No Pokemons captured yet </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  safeAreaStyle: {
    flex: 1,
    backgroundColor: '#f0f3f5',
  },
  headerContainer: {
    height: 240,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 20,
  },
  textTitleStyle: {
    fontSize: 20,
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  textInputStyle: {
    marginBottom: 20,
  },
  touchableOpacityStyle: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C4C4C4',
    borderRadius: 8,
  },
  touchableOpacityEnableStyle: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6A46F3',
    borderRadius: 8,
  },
  textButtonStyle: {
    textTransform: 'uppercase',
    color: 'white',
  },
  textButtonEnableStyle: {
    textTransform: 'uppercase',
    color: 'white',
    fontWeight: '600',
  },
});
