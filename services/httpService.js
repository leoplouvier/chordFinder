import { setChordError } from "../redux/store";

const urls = {
  chordWithPosition: "https://api.uberchord.com/v1/chords?voicing=",
  positionWithChord: "https://api.uberchord.com/v1/chords?nameLike=",
};

export const getChordWithPosition = async (position) => {
  try {
    let response = await fetch(urls.chordWithPosition + position),
      data = await response.json()
      let chordStr = data[0].chordName.split(","),
      chordObj = {
        root: chordStr[0],
        quality: chordStr[1],
        tension: chordStr[2],
        bass: chordStr[3],
      };
    return { ...data[0], chordObj };
  } catch (error) {
    setChordError(true);
    return {error};
  }
};

export const getPositionWithChord = async (chord, callback = null) => {
  try {
    let response = await fetch(urls.positionWithChord + chord),
      data = await response.json();
    let formatedData = data.map((d) => {
      let chordArray = d.chordName.split(",");
      return {
        ...d,
        chord: {
          root: chordArray[0],
          quality: chordArray[1],
          tension: chordArray[2],
        },
      };
    });
    if (callback) {
      callback();
    }
    return formatedData;
  } catch (error) {
    if (callback) {
      callback();
    }
    return null;
  }
};
