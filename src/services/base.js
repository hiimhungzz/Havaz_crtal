import Axios from "axios";
import { API_BASE_URL, JWT_TOKEN } from "@Constants";
import { $Token } from "@Helpers/token";
import { Ui } from "@Helpers/Ui";
import _ from "lodash";
import { DEFAULT_RESPONSE_MESSAGE } from "@Constants/common";
import React from "react";
import { Redirect } from "react-router-dom";
import { Alert } from "antd";
export function requestJson(options) {
  let config = {
    baseURL: API_BASE_URL,
    timeout: 30000000,
    headers: {
      "Content-Type": "application/json",
      jwtToken: $Token.get(JWT_TOKEN),
    },
  };
  return Axios.post(options.url, options.data, config).then(
    (response) => {
      return response;
    },
    ({ response }) => {
      Ui.showError({
        message: _.isString(response.data.message)
          ? response.data.message
          : DEFAULT_RESPONSE_MESSAGE[500],
      });
      return response;
    }
  );
}

export function requestJsonUpload(options) {
  let config = {
    baseURL: API_BASE_URL,
    timeout: 30000000,
    headers: {
      "Content-Type": "multipart/form-data",
      jwtToken: $Token.get(JWT_TOKEN),
    },
    // withCredentials: true
  };
  return Axios.post(options.url, options.data, config).then(
    (response) => {
      return response;
    },
    ({ response }) => {
      Ui.showError({ message: "Upload ảnh lỗi." });
      return response;
    }
  );
}

export function requestJsonPost(options) {
  let config = {
    baseURL: API_BASE_URL,
    timeout: 1000,
    headers: {
      "Content-Type": "application/json",
      jwtToken: $Token.get(JWT_TOKEN),
    },
    // withCredentials: true
  };
  return Axios.post(options.url, options.data, config).then(
    (response) => {
      return response;
    },
    ({ response }) => {
      if (response.status === "403") {
        Ui.showError({
          message: response.data.message
            ? response.data.message.toString()
            : "Thất bại",
        });
      } else {
        response.data.errors.forEach((index) => {
          Ui.showError({
            message: index.msg ? index.msg.toString() : "Thất bại",
          });
        });
      }
      return response;
    }
  );
}

export function requestJsonGet(options) {
  try {
    const xhr = Axios.create({
      baseURL: API_BASE_URL,
      timeout: 100000,
      headers: {
        "Content-Type": "application/json",
        jwtToken: $Token.get(JWT_TOKEN),
      },
    });
    return xhr
      .get(options.url, {
        params: options.data,
      })
      .then((response) => {
        console.log("response1", response);
        return response;
      })
      .catch((err) => {
        console.log("err", err.message);
      });
  } catch (error) {
    return error;
  }
  // ({ response }) => {
  //   try {
  //     if (!response) {
  //       return <Redirect to="/notFound" />;
  //     }
  //     if (response) {
  //       if (response.status === "403") {
  //         Ui.showError({
  //           message: response.data.message
  //             ? response.data.message.toString()
  //             : "Thất bại",
  //         });
  //       } else {
  //         response.data.errors.forEach((index) => {
  //           Ui.showError({
  //             message: index.msg ? index.msg.toString() : "Thất bại",
  //           });
  //         });
  //       }
  //       return response;
  //     }
  //   } catch (error) {
  //     return error;
  //   }
  // }
}
export function requestPlaces({ url, param }) {
  const xhr = Axios.create({
    baseURL: "https://place.havaz.vn/api",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      "Accept-Encoding": "gzip, deflate",
      Connection: "keep-alive",
      "cache-control": "no-cache",
    },
    timeout: 30000000,
  });
  return xhr
    .get(url, {
      params: param,
    })
    .then(
      (response) => {
        return response;
      },
      (res) => {
        return res;
      }
    );
}

export function requestJsonPut(options) {
  const xhr = Axios.create({
    baseURL: API_BASE_URL,
    timeout: 1000,
    headers: {
      "Content-Type": "application/json",
      jwtToken: $Token.get(JWT_TOKEN),
    },
  });
  return xhr.put(options.url, options.data).then(
    (response) => {
      return response;
    },
    ({ response }) => {
      if (response.status === "403") {
        Ui.showError({
          message: response.data.message
            ? response.data.message.toString()
            : "Thất bại",
        });
      } else {
        response.data.errors.forEach((index) => {
          Ui.showError({
            message: index.msg ? index.msg.toString() : "Thất bại",
          });
        });
      }
      return response;
    }
  );
}

export function requestJsonDelete(options) {
  const xhr = Axios.create({
    baseURL: API_BASE_URL,
    timeout: 1000,
    headers: {
      "Content-Type": "application/json",
      jwtToken: $Token.get(JWT_TOKEN),
    },
  });
  return xhr.delete(options.url, options.data).then(
    (response) => {
      return response;
    },
    ({ response }) => {
      if (response.status === "403") {
        Ui.showError({
          message: response.data.message
            ? response.data.message.toString()
            : "Thất bại",
        });
      } else {
        response.data.errors.forEach((index) => {
          Ui.showError({
            message: index.msg ? index.msg.toString() : "Thất bại",
          });
        });
      }

      return response;
    }
  );
}

export function requestDownload(options) {
  const xhr = Axios.create({
    baseURL: API_BASE_URL,
    timeout: 100000,
    headers: {
      jwtToken: $Token.get(JWT_TOKEN),
    },
  });
  return xhr
    .get(options.url, {
      params: options.data,
    })
    .then(
      (response) => {
        return response;
      },
      ({ response }) => {
        if (response.status === "403") {
          Ui.showError({
            message: response.data.message
              ? response.data.message.toString()
              : "Thất bại",
          });
        } else {
          response.data.errors.forEach((index) => {
            Ui.showError({
              message: index.msg ? index.msg.toString() : "Thất bại",
            });
          });
        }
        return response;
      }
    );
}
export function requestExtractDownload(options) {
  return fetch(`${API_BASE_URL}${options.url}`, {
    headers: {
      jwtToken: $Token.get(JWT_TOKEN),
      "Content-Type": "application/json",
    },
    timeout: 1000000,
    method: "POST",
    body: JSON.stringify({
      ...options.data,
      jwtToken: $Token.get(JWT_TOKEN),
    }),
    // body: JSON.stringify(options.data)
  })
    .then((res) => res)
    .catch((error) => {
      console.log(error);
      return error;
    });
}
