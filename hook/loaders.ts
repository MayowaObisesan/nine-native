import {fetch} from 'expo/fetch';
import {useEffect, useState} from 'react';

export async function getUserApps(userId: string) {
  let data = null;
  let isLoading = true;
  let isError = false;
  let nextPageData = {};
  const fetchConfig = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      // 'Origin': '*',
      // 'Authorization': `Bearer ${localStorage.getItem('nine_login')}`
    },
    modes: 'cors',  // options: cors, no-cors, same-origin, navigate, websocket
    cache: 'default',   // options: default, no-store, reload, no-cache, force-cache, only-if-cached
  }

  await fetch(`${process.env.REACT_APP_BASE_URL}/user/${userId}/apps/`, fetchConfig)
    .then(response => {
      if (response.status > 400) {
        // Display a fixed notification page and show the network error page.
        // return setResponseDetails('Error fetching apps. Try again.');
      }
      return response.body;
    })
    .then(res_data => {
      isLoading = false;
      data = res_data;
      if (data?.next) nextPageData = {hasNextPage: true, next: data.next}
    }).catch(err => {
      console.log('Error fetch data: ' + err)
      isError = true;
      isLoading = false;
    });
  return {data, isLoading, isError, nextPageData};
}

export function useUserApps(userId: string) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [nextPageData, setNextPageData] = useState<any>({});

  useEffect(() => {
    let isMounted = true;
    const fetchUserApps = async () => {
      setIsLoading(true);
      setIsError(false);

      const fetchConfig = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        modes: 'cors',
        cache: 'default',
      };

      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/user/${userId}/apps/`, fetchConfig);
        if (response.status > 400) {
          // Handle error based on response status if needed.
        }
        const res_data = await response.body;
        if (isMounted) {
          setData(res_data);
          if (res_data?.next) {
            setNextPageData({hasNextPage: true, next: res_data.next});
          } else {
            setNextPageData({});
          }
        }
      } catch (err) {
        console.log('Error fetching data: ' + err);
        if (isMounted) {
          setIsError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUserApps();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return {data, isLoading, isError, nextPageData};
}
