import React, { useEffect, useContext, useState } from 'react'
import { StyleSheet, View, Pressable } from 'react-native'
import TextRegular from '../../components/TextRegular'
import TextSemibold from '../../components/TextSemibold'
import { brandPrimary, brandPrimaryTap, brandSecondary, flashStyle, flashTextStyle } from '../../styles/GlobalStyles'
import { AuthorizationContext } from '../../context/AuthorizationContext'
import { showMessage } from 'react-native-flash-message'
import { getMyOrders } from '../../api/OrderEndpoints'
import { FlatList } from 'react-native-web'
import ImageCard from '../../components/ImageCard'

export default function OrdersScreen ({ navigation, route }) {
  const [orders, setOrders] = useState([])
  const { loggedInUser } = useContext(AuthorizationContext)

  useEffect(() => {
    async function fetchOrders () {
      try {
        const fetchedOrders = await getMyOrders()
        setOrders(fetchedOrders)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving the orders. ${error}`,
          type: 'error',
          style: flashStyle,
          textStyle: flashTextStyle
        })
      }
    }
    if (loggedInUser) {
      fetchOrders()
    } else {
      setOrders(null)
    }
  }, [loggedInUser])

  const renderOrders = ({ item }) => {
    return (
      <ImageCard
        imageUri={item.restaurant.logo ? { uri: process.env.API_BASE_URL + '/' + item.restaurant.logo } : undefined}
        onPress={() => {
          navigation.navigate('OrderDetailScreen', { id: item.id })
        }}
      >
      <View style={{ marginLeft: 20 }}>
        <TextSemibold style={styles.title}>Order {item.id}</TextSemibold>
        <TextSemibold numberOfLines={2}>Created at: {item.createdAt}</TextSemibold>
        <TextSemibold>Shipping: <TextRegular style={{ color: brandPrimary }}>{item.shippingCosts.toFixed(2)} €</TextRegular></TextSemibold>
        <TextSemibold>Status: <TextRegular style={{ color: brandPrimary }}>{item.status}</TextRegular></TextSemibold>
      </View>
      </ImageCard>
    )
  }

  const renderEmptyOrder = () => {
    return (
      <TextRegular textStyle={styles.emptyList}>
        No orders were retreived. Have you made any orders?
      </TextRegular>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderOrders}
        ListEmptyComponent={renderEmptyOrder}
        />
        {/* <TextSemiBold>FR5: Listing my confirmed orders</TextSemiBold>
        <TextRegular>A Customer will be able to check his/her confirmed orders, sorted from the most recent to the oldest.</TextRegular>
        <Pressable
            onPress={() => {
              navigation.navigate('OrderDetailScreen', { id: route.params.id })
            }}
            style={({ pressed }) => [
              {
                backgroundColor: pressed
                  ? brandPrimaryTap
                  : brandPrimary
              },
              styles.button
            ]}
        >
            <TextRegular textStyle={styles.text}>Go to Order Detail Screen</TextRegular>
        </Pressable> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    borderRadius: 8,
    height: 40,
    margin: 12,
    padding: 10,
    width: '100%'
  },
  text: {
    fontSize: 16,
    color: brandSecondary,
    textAlign: 'center'
  },
  textTitle: {
    fontSize: 20,
    color: 'black'
  }
})
