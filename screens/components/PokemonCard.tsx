/* eslint-disable react/react-in-jsx-scope */
import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

const PokemonCard = ({id, name, image}) => {
  return (
    // eslint-disable-next-line react/react-in-jsx-scope
    <View style={styles.pokemonContainer}>
      <Image
        source={{uri: image}}
        resizeMode="contain"
        style={styles.pokemonImageStyle}
      />
      <Text>id: {id}</Text>
      <Text>name: {name}</Text>
    </View>
  );
};

export default PokemonCard;

const styles = StyleSheet.create({
  pokemonImageStyle: {
    width: 100,
    height: 100,
  },
  pokemonContainer: {
    width: 120,
    height: 140,
    borderRadius: 15,
    backgroundColor: 'white',
    alignItems: 'center',
    margin: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: {width: 5, height: 15},
    shadowRadius: 8,
  },
});
