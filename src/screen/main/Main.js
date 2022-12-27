import axios from "axios";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    View,
    Image,
    ActivityIndicator
} from "react-native";

const Main = () => {
    const [characters, setCharacters] = useState([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)

    useEffect(() => {
        getCharacters()
    }, [page])

    const getCharacters = () => {
        setLoading(true)
        // Here we call the api to get all the character by pagination
        axios.get(`https://rickandmortyapi.com/api/character?page=${page}`)
            .then(async (res) => {
                for (var i in res.data.results) {
                    if (res.data.results[i].origin.url) {
                        // Here we get character origin dimensions and amount of residents
                        const data = await axios.get(`https://rickandmortyapi.com/api/location/${res.data.results[i].id}`)
                        res.data.results[i].origin.data = data.data
                    }
                    if (res.data.results[i].location.url) {
                        // Here we get character location dimensions and amount of residents
                        const data = await axios.get(`https://rickandmortyapi.com/api/location/${res.data.results[i].id}`)
                        res.data.results[i].location.data = data.data
                    }
                }
                if (page === 1) {
                    // In initial when page is 1 then we are just putting the array in state
                    setCharacters(res.data.results)
                } else {
                    // Here we are adding both previous and current data in state
                    var data = characters
                    for (var i in res.data.results) {
                        data.push(res.data.results[i])
                    }
                    setCharacters(data)
                }

                setLoading(false)
            })
            .catch((error) => {
                setLoading(false)
                console.log("error", error)
            })
    }

    const renderCardView = item => {
        return (
            <View style={styles.card}>
                <Image
                    style={styles.image}
                    source={{
                        uri: item.item.image,
                    }}
                />
                <View style={styles.main}>
                    <Text style={styles.name}> {item.item.name} </Text>
                    <View style={styles.speciesView}>
                        <Text style={styles.species}>{item.item.species} ,</Text>
                        <Text style={styles.species}>{item.item.gender}</Text>
                    </View>
                    <View style={styles.location}>
                        {
                            item.item.origin?.data?.type &&
                            <View>
                                <Text style={styles.locationTitle}>Origin :</Text>
                                <Text>{item.item.origin.name} , {item.item.origin?.data?.type} , {item.item.origin?.data?.residents.length}</Text>
                            </View>
                        }
                        <View />
                        {
                            item.item.location?.data?.type &&
                            <View>
                                <Text style={styles.locationTitle}>Location :</Text>
                                <Text>{item.item.location.name} , {item.item.location?.data?.type} , {item.item.location?.data?.residents.length}</Text>
                            </View>
                        }

                    </View>
                </View>
            </View >
        )
    }

    // We have created this function to show loader at the bottom of the list.
    const renderFooter = () => {
        return (
            <View>
                {loading && <ActivityIndicator color={'black'} />}
            </View>
        )
    }

    //This function will call when the list ends to load more data.
    const fetchMoreData = () => {
        setPage(page + 1)
    }

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.title}>Characters</Text>
                {/* I Used flatlist to render character in cards */}
                <FlatList
                    data={characters}
                    renderItem={renderCardView}
                    keyExtractor={item => item.id}
                    onEndReachedThreshold={0.01}
                    ListFooterComponent={renderFooter}
                    onEndReached={fetchMoreData}
                />
            </View>
        </>
    )
}

export default Main;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e9f5f8'
    },
    title: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        color: 'black'
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        margin: 12,
        flexDirection: 'row'
    },
    image: {
        height: 80,
        width: 80,
        borderRadius: 8
    },
    main: {
        marginLeft: 10
    },
    speciesView: {
        flexDirection: 'row'
    },
    name: {
        fontWeight: 'bold',
        fontSize: 17,
        color: 'black'
    },
    species: {
        color: 'black',
        marginLeft: 4,
        marginTop: 2
    },
    location: {
        justifyContent: 'space-evenly',
        width: '90%',
        marginLeft: 5
    },
    locationTitle: {
        fontSize: 16,
        color: 'black',
        fontWeight: '700'
    }
})