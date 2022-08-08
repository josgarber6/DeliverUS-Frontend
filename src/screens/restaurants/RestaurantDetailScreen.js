/* eslint-disable react/prop-types */
import React, { useEffect, useState, useContext } from 'react'
import { StyleSheet, View, FlatList, ImageBackground, Image, Pressable } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { getDetail } from '../../api/RestaurantEndpoints'
import ImageCard from '../../components/ImageCard'
import TextRegular from '../../components/TextRegular'
import TextSemiBold from '../../components/TextSemibold'
import { brandPrimary, brandPrimaryTap, brandSecondary, flashStyle, flashTextStyle } from '../../styles/GlobalStyles'
import { TextInput } from 'react-native-web'
import { AuthorizationContext } from '../../context/AuthorizationContext'

export default function RestaurantDetailScreen ({ navigation, route }) {
  const [restaurant, setRestaurant] = useState({})
  const [precio, setPrecio] = useState([])
  const [quantities, setQuantity] = useState([])
  const { loggedInUser } = useContext(AuthorizationContext)

  // FR2: Restaurant details and menu. Customers will be able to query restaurants details and the products offered by them.

  useEffect(() => {
    async function fetchRestaurantDetail () {
      try {
        const fetchedRestaurant = await getDetail(route.params.id)
        const cantidad = fetchedRestaurant.products.map(x => 0)
        setQuantity(cantidad)
        setPrecio(cantidad)
        setRestaurant(fetchedRestaurant)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving restaurants. ${error} `,
          type: 'error',
          style: flashStyle,
          titleStyle: flashTextStyle
        })
      }
    }
    fetchRestaurantDetail()
  }, [loggedInUser, route])

  const renderHeader = () => {
    return (
      <View>
        <ImageBackground source={(restaurant?.heroImage) ? { uri: process.env.API_BASE_URL + '/' + restaurant.heroImage, cache: 'force-cache' } : undefined} style={styles.imageBackground}>
          <View style={styles.restaurantHeaderContainer}>
            <TextSemiBold textStyle={styles.textTitle}>{restaurant.name}</TextSemiBold>
            <Image style={styles.image} source={restaurant.logo ? { uri: process.env.API_BASE_URL + '/' + restaurant.logo, cache: 'force-cache' } : undefined} />
            <TextRegular textStyle={styles.description}>{restaurant.description}</TextRegular>
            <TextRegular textStyle={styles.description}>{restaurant.restaurantCategory ? restaurant.restaurantCategory.name : ''}</TextRegular>
          </View>
        </ImageBackground>
      </View>
    )
  }

  function updatePriceQuantity ({ quantity, index, item }) {
    // Updating the quantity
    const auxQuantity = [...quantities]
    auxQuantity[index] = parseInt(quantity)
    setQuantity(auxQuantity)
    // Updating the price
    const precioAux = [...precio]
    precioAux[index] = item.price * quantity
    setPrecio(precioAux)
  }

  const renderProduct = ({ item, index }) => {
    return (
      <View style={{ flex: 5, padding: 10 }}>
      <ImageCard
        imageUri={item.image ? { uri: process.env.API_BASE_URL + '/' + item.image } : undefined}
        title={item.name}
        >
        <TextRegular numberOfLines={2}>{item.description}</TextRegular>
        <TextSemiBold textStyle={styles.price}>{item.price.toFixed(2)}€</TextSemiBold>
        {/* We'll do here an input to show a little card in which the client can put the quantity he wants. */}
        <View>
          <TextRegular>Cantidad:
              <TextRegular textStyle={{ paddingLeft: 50 }}>Precio total: <TextSemiBold>{precio[index]} €</TextSemiBold></TextRegular>
              </TextRegular>
          <View style={{ alignItems: 'flex-start' }}>
            <View style={{ width: 50 }}>
            {/* FR3: Add, edit and remove products to a new order.
                A customer can add several products, and several units of a product to a new order.
                Before confirming, customer can edit and remove products.
                Once the order is confirmed, it cannot be edited or removed. */}
              <TextInput
                style={styles.input}
                name='quantity'
                placeholder='0'
                keyboardType='numeric'
                onChangeText={quantity => updatePriceQuantity({ quantity, index, item })}
                />
            </View>
          </View>
        </View>
      </ImageCard>
    </View>
    )
  }

  const renderFooter = () => {
    return (
      <Pressable
        onPress={() => navigation.navigate('ConfirmOrderScreen', { quantities: quantities, price: precio, id: route.params.id })}
        style={({ pressed }) => [
          {
            backgroundColor: pressed
              ? brandPrimaryTap
              : brandPrimary
          },
          styles.button
        ]}>
        <TextRegular textStyle={styles.text}>
          Create order
        </TextRegular>
      </Pressable>
    )
  }

  const renderEmptyProductsList = () => {
    return (
      <TextRegular textStyle={styles.emptyList}>
        This restaurant has no products yet.
      </TextRegular>
    )
  }

  return (
      <FlatList
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyProductsList}
          style={styles.container}
          data={restaurant.products}
          renderItem={renderProduct}
          keyExtractor={item => item.id.toString()}
          ListFooterComponent={renderFooter}
        />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    padding: 15,
    marginBottom: 5,
    backgroundColor: brandSecondary
  },
  restaurantHeaderContainer: {
    height: 250,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'column',
    alignItems: 'center'
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center'
  },
  image: {
    height: 100,
    width: 100,
    margin: 10
  },
  description: {
    color: 'white'
  },
  textTitle: {
    fontSize: 20,
    color: 'white'
  },
  emptyList: {
    textAlign: 'center',
    padding: 50
  },
  button: {
    borderRadius: 8,
    height: 40,
    marginTop: 10,
    marginBottom: 12,
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    fontSize: 16,
    color: brandSecondary,
    textAlign: 'center',
    marginLeft: 5
  },
  input: {
    borderRadius: 8,
    height: 20,
    borderWidth: 1,
    padding: 15,
    marginTop: 10
  }
})
