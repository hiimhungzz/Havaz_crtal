/* eslint-disable default-case */
import Axios from "axios";
import Result from "./Result";
import _ from "lodash";
import { $Token } from "@Helpers/token";
import { JWT_TOKEN, API_BASE_URL } from "@Constants";
import { DEFAULT_RESPONSE_MESSAGE } from "@Constants/common";

export default class ServiceBase {
  static async requestJson(opts) {
    let axiosResult = null;
    let result = null;
    let axiosRequestConfig = {
      baseURL: opts.baseUrl || API_BASE_URL,
      timeout: 30000000,
      headers: {
        "Content-Type": _.get(opts, "contentType", "application/json"),
        jwtToken: $Token.get(JWT_TOKEN),
      },
    };

    try {
      switch (opts.method) {
        case "GET":
          axiosResult = await Axios.get(opts.url, {
            ...axiosRequestConfig,
            params: opts.data,
          });
          break;
        case "POST":
          axiosResult = await Axios.post(
            opts.url,
            opts.data,
            axiosRequestConfig
          );
          break;
        case "PUT":
          axiosResult = await Axios.put(
            opts.url,
            opts.data,
            axiosRequestConfig
          );
          break;
        case "DELETE":
          axiosResult = await Axios.delete(opts.url, axiosRequestConfig);
          break;
      }
      result = new Result(axiosResult.data, null);
    } catch (error) {
      let messages = error.message;
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        if (_.isString(error.response.data.message)) {
          messages = error.response.data.message;
        } else if (_.isObject(error.response.data.message)) {
          messages = DEFAULT_RESPONSE_MESSAGE[500];
        }
        return new Result(null, messages);
      } else if (
        _.get(error, "response.data.errors", []) &&
        _.get(error, "response.data.errors", []).length > 0
      ) {
        messages = _.map(_.get(error, "response.data.errors", []), (err) =>
          _.get(err, "msg")
        );
        return new Result(null, messages);
      }
      return new Result(null, messages);
    }
    return result;
  }
}
