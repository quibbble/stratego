import axios from 'axios';
import { CONFIG } from "../components/Config";

axios.defaults.withCredentials = true;

export const CreateGame = async (id, teams, turnLength) => {
    let config = {
        method: 'POST',
        url: `http${ CONFIG.scheme }://${ CONFIG.host }/game/create`,
        headers: {
            'Content-Type': 'application/json'
        },
        data : JSON.stringify({
            GameKey: CONFIG.key,
            GameID: id,
            Teams: teams,
            TurnLength: turnLength,
            MoreOptions: {
                Seed: Date.now(),
            }
        })
    };
    return axios(config)
        .catch(error => error.response)
        .then(response => response.status);
};

export const LoadGame = async (id, bgn) => {
    let config = {
        method: 'POST',
        url: `http${ CONFIG.scheme }://${ CONFIG.host }/game/load`,
        headers: {
            'Content-Type': 'application/json'
        },
        data : JSON.stringify({
            GameKey: CONFIG.key,
            GameID: id,
            BGN: bgn
        })
    };
    return axios(config)
        .catch(error => error.response)
        .then(response => response.status)
};

export const GetBGN = async (id) => {
    let config = {
        method: 'GET',
        url: `http${ CONFIG.scheme }://${ CONFIG.host }/game/bgn?GameKey=${ CONFIG.key }&GameID=${id}`,
    };
    return axios(config)
        .catch(error => error.response)
};

export const Health = async () => {
    let config = {
        method: 'GET',
        url: `http${ CONFIG.scheme }://${ CONFIG.host }/health`,
    };
    return axios(config)
        .catch(error => error.response)
};
