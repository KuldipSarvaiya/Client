import axios from "axios";

export async function EncodeData(props) {
  const res = await axios.post("/encode_my_data", props);
  // console.log("setting data = ", res.data);
  if (res.data.error === true) {
    alert(
      `${res.data.message}, Encoding Your information is failed  `
    );
    return undefined;
  } else return res.data.jwt;
}

export async function DecodeData({ token }) {
  const res = await axios.post("/decode_my_data", { token });
  // console.log("getting token = ", token);
  // console.log("Data That We HAve Decoded = ", res.data);
  if (res.data.error === true) {
    alert(
      `${res.data.message}, Decoding Your information is failed `
    );
    return undefined;
  } else return res.data.data;
}
