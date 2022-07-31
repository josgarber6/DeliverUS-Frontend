/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, FlatList, ImageBackground, Image, Pressable } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { getDetail } from '../../api/RestaurantEndpoints'
import ImageCard from '../../components/ImageCard'
import TextRegular from '../../components/TextRegular'
import TextSemiBold from '../../components/TextSemibold'
import { brandPrimary, brandPrimaryTap, brandSecondary, flashStyle, flashTextStyle } from '../../styles/GlobalStyles'
import { getOrderDetail } from '../../api/OrderEndpoints'

export default function OrderDetailScreen ({ navigation, route }) {
  const [order, setOrder] = useState([])
  useEffect(() => {
    async function fetchOrderDetail () {
      try {
        const fetchedOrder = await getOrderDetail(route.params.id)
        setOrder(fetchedOrder)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving your orders. ${error}`
        })
      }
    }
    fetchOrderDetail()
  }, [route])

  const renderHeader = () => {
    return (
      <View>
        <ImageBackground source={(order.restaurant?.heroImage) ? { uri: process.env.API_BASE_URL + '/' + order.restaurant.heroImage, cache: 'force-cache' } : undefined} style={styles.imageBackground}>
          <View style={styles.restaurantHeaderContainer}>
            <TextSemiBold textStyle={styles.textTitle}>Order {order.id}</TextSemiBold>
            <Image style={styles.image} source={order.restaurant.logo ? { uri: process.env.API_BASE_URL + '/' + order.restaurant.logo, cache: 'force-cache' } : undefined} />
          </View>
        </ImageBackground>
      </View>
    )
  }

  const renderEmptyProductsList = () => {
    return (
      <TextRegular>
        No products can be shown. Please order some products.
      </TextRegular>
    )
  }

  const renderProduct = ({ item }) => {
    let price = 0.0
    price += item.OrderProducts.price * item.OrderProducts.quantity
    return (
      <ImageCard
        imageUri={item.image ? { uri: process.env.API_BASE_URL + '/' + item.image } : undefined}
        title={item.name}
        >
        <TextRegular numberOfLines={2}>{item.description}</TextRegular>
        <TextSemiBold textStyle={styles.price}>{item.price.toFixed(2)}€</TextSemiBold>
        <View style={{ marginTop: 10 }}>
          <TextRegular style={styles.text}>Cantidad: {item.OrderProducts.quantity}</TextRegular>
          <TextRegular style={styles.text}>Precio unitario: {item.OrderProducts.price}</TextRegular>
          {price && <TextRegular style={styles.text}>Precio total: {price.toFixed(2)}</TextRegular>}
        </View>
      </ImageCard>
    )
  }

  const renderFooter = () => {
    return (
      <Pressable
        onPress={() => { navigation.navigate('RestaurantsScreen') }}
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
  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyProductsList}
        style={styles.container}
        data={order.products}
        renderItem={renderProduct}
        keyExtractor={item => item.id.toString()}
        ListFooterComponent={renderFooter}
      >

      </FlatList>

          {/* <TextSemiBold>FR6: Show order details</TextSemiBold>
          <TextRegular>A customer will be able to look his/her orders up. The system should provide all details of an order, including the ordered products and their prices.</TextRegular> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 50
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
    marginTop: 12,
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
  }
})
