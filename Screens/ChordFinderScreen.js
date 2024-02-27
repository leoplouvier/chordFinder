import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import GuitarNeck from "../components/GuitarNeck";
import GuitarInput from "../components/GuitarInput";
import ChordText from "../components/ChordText";
import { withAccessToStore } from "../redux/store";
import { theme } from "../utils/styleUtils";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { getChordCurrentTranslation } from '../redux/store'
import { useTranslation } from "react-i18next";

const screenHeight = Dimensions.get('window').height - 150; // -150 for header
const ChordFinder = (props) => {
  const { t, i18n } = useTranslation();
  const modes = ["InputMode", "NeckMode"];
  const [currentMode, changeMode] = useState(modes[0]);
  const [chord, setChord] = useState(props.state.chord.chordObj);
  const scrollRef = useRef();
  let scrollInit = 0;

  const beginScroll = (event) => {
    scrollInit = event.contentOffset.x
  }
  const endScroll = (event) => {
    const x = event.contentOffset.x
    if(x - scrollInit > 0){
      changeMode(modes[1]);
      scrollRef.current.scrollToEnd({animated: true})
    }else{
      changeMode(modes[0]);
      scrollRef.current.scrollTo({x: 0, y: 0, animated: true})
    }
  }
  const scrollBetweenMode = () => {
    if(currentMode === modes[0]){
      changeMode(modes[1]);
      scrollRef.current.scrollToEnd({animated: true})
    }else{
      changeMode(modes[0]);
      scrollRef.current.scrollTo({x: 0, y: 0, animated: true});
    }
  }
  const onFetchedChord = () => {
    if(currentMode === modes[1]){
      changeMode(modes[0]);
      scrollRef.current.scrollTo({x: 0, y: 0, animated: true});
    }
  }

  useEffect(()=>{
    setChord(props.state.chord?.chordObj);
  },[props.state.chord])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false} style={{height:screenHeight}}>
      <View style={styles.container}>
        <View style={currentMode === modes[0] ?{...styles.modeSelection, right:0}:{...styles.modeSelection, left:0}}>
          <TouchableOpacity style={styles.modeButton} onPress={() => scrollBetweenMode()}>
            {currentMode === modes[0] && <View style={{position:"relative",marginRight:5, opacity:0.6}}>
              <FontAwesome5 name="hand-point-right" size={15} color={"#fff"} solid style={{ opacity:0.6, position:"absolute", top:-7, left:0,transform:[{rotate: '45deg'}]}}/>
              <FontAwesome5 name="guitar" size={25} color={"#fff"} style={{opacity:0.6}}/>
            </View>
            }
          <View style={styles.modeArrows}>
            {[1,2,3].map(n=>{
              const opacity = 0.2 * (currentMode === modes[1] ? 4 - n : n);
              return <FontAwesome5 
              key={n}
              name={currentMode === modes[1] ? "chevron-left" : "chevron-right"} 
              size={20} 
              color={"#fff"}  
              style={{opacity : opacity}}/>
            })
            }
          {currentMode === modes[1] && <View style={{position:"relative",marginLeft:5, opacity:0.6}}>
              <FontAwesome5 name="keyboard" size={15} color={"#fff"} solid style={{ opacity:0.6, position:"absolute", top:-10, right:-5}}/>
              <FontAwesome5 name="guitar" size={25} color={"#fff"} style={{opacity:0.6, transform: [{rotate: '-90deg'}]}}/>
            </View>
            }
          </View>
          </TouchableOpacity>
        </View>
        <ScrollView ref={scrollRef} horizontal style={{height:screenHeight}} onScrollBeginDrag={(e) => {beginScroll(e.nativeEvent)}} onScrollEndDrag={(e) => {endScroll(e.nativeEvent)}}>
          <GuitarInput state={props.state} onFetched={() => onFetchedChord()}/>
          <GuitarNeck onPress={() => onFetchedChord()} />
        </ScrollView>
        {chord && currentMode === modes[0] ? (
          <ChordText
            root={getChordCurrentTranslation(chord.root)}
            quality={chord.quality}
            tension={chord.tension}
            color="primary"
            styling={{position:"absolute", bottom: 0, width:"100%" ,justifyContent:"center", height: "25%"}}
          />
        ) : (
          ""
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};
export default withAccessToStore(ChordFinder);

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.color.background,
    height: screenHeight,
    position:"absolute"
  },
  modeSelection: {
    flexDirection: "row",
    alignItems: "center",
    padding:10,
    position:"absolute",
    zIndex:1000
  },
  modeButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  modeArrows: {
    flexDirection: "row",
    alignItems: "center",
  },
});
