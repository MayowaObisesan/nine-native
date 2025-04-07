import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {Text} from '~/components/ui/text';
import {LinearGradient} from 'expo-linear-gradient';
import {useColorScheme} from "~/lib/useColorScheme";
import {SwiperFlatList} from "react-native-swiper-flatlist";

const {width: windowWidth} = Dimensions.get('window');

export const CarouselItem = (
  {
    subText1,
    mainText,
    subText2,
  }: {
    subText1: string;
    mainText: string;
    subText2: string;
  }) => {
  return (
    <View style={styles.carouselItem}>
      <View style={styles.textContainer}>
        <Text className={"text-3xl"} style={styles.subText}>{subText1}</Text>
        <Text className={"font-black text-5xl py-4"} style={styles.mainText}>{mainText}</Text>
        <Text className={"text-3xl"} style={styles.subText}>{subText2}</Text>
      </View>
      {/*<Image
        source={require('../../assets/images/stock/photo-1625726411847-8cbb60cc71e6.jpg')}
        style={styles.image}
        resizeMode="cover"
      />*/}
    </View>
  );
};

const HomeCarousel = () => {
  const {isDarkColorScheme} = useColorScheme();

  return (
    <View style={styles.container}>
      {/* Radial gradient approximation */}
      <LinearGradient
        colors={isDarkColorScheme ? ['#171520', '#1e1b2f', '#121936'] : ['#f7e5f0', '#eeebff', '#d2dfff']}
        style={styles.gradientLayer}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
      />
      {/* Linear gradient overlay */}
      {/*<LinearGradient
        colors={['rgba(255,255,255,0.5)', 'rgba(255,255,255,0)']}
        style={styles.gradientLayer}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />*/}
      {/*<ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.carousel}
      >*/}
      <SwiperFlatList
        autoplay
        autoplayDelay={8}
        autoplayLoop
        index={0}
        showPagination
        paginationStyleItem={{
          width: 5,
          height: 5
        }}
        paginationStyleItemActive={{
          backgroundColor: isDarkColorScheme ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
        }}
        paginationStyleItemInactive={{
          backgroundColor: isDarkColorScheme ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)",
        }}
      >
        <View style={{width: windowWidth}}>
          <CarouselItem subText1="Every" mainText="Built-in-Naija" subText2="apps in one place"/>
        </View>
        {/*<View style={{width: windowWidth}}>
          <CarouselItem subText1="Manage all" mainText="your Projects" subText2="from one platform"/>
        </View>*/}
        {/*<View style={{width: windowWidth}}>
          <CarouselItem subText1="The" mainText="Github" subText2="app you never had"/>
        </View>*/}
        {/*<View style={{width: windowWidth}}>
          <CarouselItem subText1="The only" mainText="Github" subText2="app you will ever need"/>
        </View>*/}
        <View style={{width: windowWidth}}>
          <CarouselItem subText1="Showcase your" mainText="Portfolio" subText2="of projects"/>
        </View>
        <View style={{width: windowWidth}}>
          <CarouselItem subText1="List your" mainText="Apps" subText2="for others to see"/>
        </View>
        <View style={{width: windowWidth}}>
          <CarouselItem subText1="Gain easy" mainText="Recognition" subText2="through your apps"/>
        </View>
        <View style={{width: windowWidth}}>
          <CarouselItem subText1="Get" mainText="Motivated" subText2="by the works of others"/>
        </View>
      </SwiperFlatList>
      {/*</ScrollView>*/}
    </View>
  );
};

export default HomeCarousel;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: windowWidth,
    height: 360, // adjust for device or use conditional styling for larger devices
    overflow: "hidden",
  },
  // used for both gradient layers so they overlap correctly
  gradientLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  carousel: {
    flex: 1,
  },
  carouselItem: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    position: 'absolute',
    zIndex: 2,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  subText: {
    // fontSize: 24,
    textAlign: 'center',
  },
  mainText: {
    // fontSize: 48,
    // fontWeight: '900',
    // marginVertical: 12,
    // textAlign: 'center',
  },
  image: {
    width: windowWidth,
    height: 360,
  },
});
