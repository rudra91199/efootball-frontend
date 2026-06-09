import axios from "axios";

const currentIp = window.location.hostname;
const developmentUrl = `http://${currentIp}:5000/api`;
const productionUrl = "https://efootball-backend.vercel.app/api";

export const API = axios.create({
  baseURL: developmentUrl,
});
