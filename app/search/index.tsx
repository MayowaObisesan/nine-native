import React, {useEffect, useState} from 'react';
import {FlatList, Pressable, StyleSheet, TouchableOpacity, View,} from 'react-native';
import {NavHeaderLink} from "~/components/NavHeader";
import {Input} from '~/components/ui/input';
import {Text} from '~/components/ui/text';
import {PostgrestError} from "@supabase/supabase-js";
import {useDebounce} from '@uidotdev/usehooks';
import {useNineContext} from "~/contexts";
import {E_DBTables} from "~/types/enums";
import {Separator} from "~/components/ui/separator";
import {Skeleton} from "~/components/ui/skeleton";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "~/components/ui/tabs";
import {supabase} from "~/lib/supabase";
import {Button} from "~/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "~/components/ui/avatar";
import {router} from "expo-router";
import {useGetUserApps} from "~/hook/useApps";
import {UserCard} from "~/components/cards/UserCard";
import {ListAppCard} from "~/components/cards/AppCard";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

const data = [
  'Apple',
  'Banana',
  'Cherry',
  'Date',
  'Grape',
  'Kiwi',
  'Mango',
  'Orange',
  'Papaya',
  'Pineapple',
  'Strawberry',
  'Watermelon',
  'Blueberry',
  'Blackberry',
  'Raspberry',
  'Peach',
  'Plum',
  'Pear',
  'Pomegranate',
  'Fig',
  'Dragon Fruit',
  'Lychee',
  'Guava',
  'Passion Fruit',
  'Coconut',
  'Apricot',
  'Cantaloupe',
  'Mulberry',
  'Jackfruit',
  'Persimmon',
];

const E_Tabs = {
  APPS: "apps",
  USERS: "users"
}

export default function SearchPage() {
  const {supabaseClient} = useNineContext();
  const [query, setQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchAppsResults, setSearchAppsResults] = useState<any[]>([]);
  const [searchUsersResults, setSearchUsersResults] = useState<any[]>([]);
  const [error, setError] = useState<PostgrestError>();
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [value, setValue] = React.useState(E_Tabs.APPS);

  const filteredAppsData = searchAppsResults?.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsersData = searchUsersResults?.filter(item =>
    item.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setIsSearching(true);
  };

  useEffect(() => {
    const searchApps = async () => {
      let results: any[] = [];
      if (debouncedSearchTerm) {
        // const data = await searchHackerNews(debouncedSearchTerm);
        let {data, error} = await supabase
          .from(E_DBTables.Apps)
          .select("*")
          // Filters
          // .eq('column', 'Equal to')
          .ilike("name", `%${debouncedSearchTerm}%`)
          .range(0, 9);

        if (error) {
          setError(error);
        }

        results = data || [];
      }

      setIsSearching(false);
      setSearchAppsResults(results);
    };

    const searchUsers = async () => {
      let results: any[] = [];
      if (debouncedSearchTerm) {
        // const data = await searchHackerNews(debouncedSearchTerm);
        let {data, error} = await supabase
          .from(E_DBTables.User)
          .select("*")
          // Filters
          // .eq('column', 'Equal to')
          .ilike("username", `%${debouncedSearchTerm}%`)
          .range(0, 19);

        if (error) {
          setError(error);
        }

        results = data || [];
      }

      setIsSearching(false);
      setSearchUsersResults(results);
    };

    searchApps();
    searchUsers();
  }, [debouncedSearchTerm]);

  const TopLanguages = () => {

    return (
      <View></View>
    )
  }

  return (
    <View className={"flex-1 gap-y-4"} style={styles.container}>
      <NavHeaderLink showTitle={false} headerTitle={""}>
        <View className={"flex-1 flex-row items-center w-11/12 pr-4"}>
          <Input
            placeholder='Search...'
            value={searchTerm.toLowerCase()}
            onChangeText={handleSearch}
            aria-labelledby='inputLabel'
            aria-errormessage='inputError'
            className={"flex-1 w-full native:h-14 placeholder:font-bold font-Assistant px-6 rounded-xl border-0 bg-background"}
            autoCapitalize={'none'}
            clearButtonMode={'while-editing'}
          />
          <View className={"absolute right-8"}><FontAwesomeIcon icon={'search'} /></View>
        </View>
      </NavHeaderLink>

      <View className={"flex-1 gap-y-2"}>

        {/*<TextInput
          // className={"w-full p-4 rounded-xl"}
          style={styles.searchBox}
          placeholder="Search..."
          value={query}
          onChangeText={setQuery}
        />*/}

        <View className={"flex-1 native:h-full"}>
          <Tabs
            value={value}
            onValueChange={setValue}
            className='w-full max-w-[400px] mx-auto flex-col gap-1.5'
          >
            <TabsList className='flex-row w-full rounded-xl'>
              <TabsTrigger value={E_Tabs.APPS} className='flex-1 flex-row items-center rounded-lg'>
                <Text className={""}>Apps</Text>
                {
                  searchAppsResults?.length > 0 &&
                    <Text
                        className={"absolute right-4 w-6 h-6 font-bold text-center rounded-xl bg-error text-muted"}>
                      {searchAppsResults?.length}
                    </Text>
                }
              </TabsTrigger>
              <TabsTrigger value={E_Tabs.USERS} className='flex-1 flex-row items-center rounded-lg'>
                <Text>Users</Text>
                {
                  searchUsersResults?.length > 0 &&
                    <Text
                        className={"absolute right-4 w-6 h-6 font-bold text-center rounded-xl bg-error text-muted"}>
                      {searchUsersResults?.length}
                    </Text>
                }
              </TabsTrigger>
            </TabsList>
            <TabsContent value={E_Tabs.APPS}>
              <View>
                <View className={"flex flex-col gap-y-2 px-2"}>
                  {
                    isSearching && searchTerm.length > 0
                    && Array.from({length: 5}).map((eachItem, index) => (
                      <View key={index}>
                        <Skeleton className="rounded-xl">
                          <View className="h-20 rounded-xl bg-default-100"/>
                        </Skeleton>
                      </View>
                    ))
                  }
                </View>

                {
                  !isSearching && searchTerm.length > 0 && searchAppsResults.length > 0
                  && <FlatList
                        data={filteredAppsData}
                        keyExtractor={item => item.id}
                        renderItem={({item, index}) => (
                          <ListAppCard app={item} />
                        )}
                        ListEmptyComponent={
                          <Text className={"text-xl"} style={styles.emptyText}>No results found.</Text>
                        }
                        contentContainerClassName={"flex-auto gap-y-4"}
                    />
                }

                {
                  !isSearching && searchTerm.length > 0 && searchAppsResults.length === 0
                  && <View className={"flex flex-col justify-center gap-y-2 h-96"}>
                        <Text className={"text-lg text-center"}>
                            Nothing matches your search
                        </Text>
                    </View>
                }

                {
                  searchTerm.length === 0
                  && <View className={"flex flex-col justify-center items-center h-96 w-full"}>
                        <Text className={"text-lg text-center"}>
                            What do you want to search for?
                        </Text>
                    </View>
                }
              </View>
            </TabsContent>
            <TabsContent value={E_Tabs.USERS}>
              <View>
                <View className={"flex flex-col gap-y-2 px-2"}>
                  {
                    isSearching && searchTerm.length > 0
                    && Array.from({length: 5}).map((eachItem, index) => (
                      <View key={index}>
                        <Skeleton className="rounded-xl">
                          <View className="h-20 rounded-xl bg-default-100"/>
                        </Skeleton>
                      </View>
                    ))
                  }
                </View>

                {
                  !isSearching && searchTerm.length > 0 && searchUsersResults.length > 0
                  && <FlatList
                        data={filteredUsersData}
                        keyExtractor={item => item.email}
                        renderItem={({item, index}) => (
                          <View key={item.name}>
                            {index > 0 && <Separator className={"w-11/12 mx-auto"}/>}
                            <UserCard user={item} />
                          </View>
                        )}
                        ListEmptyComponent={
                          <Text className={"text-xl"} style={styles.emptyText}>No such user found.</Text>
                        }
                        contentContainerClassName={"flex-auto"}
                    />
                }

                {
                  !isSearching && searchTerm.length > 0 && searchUsersResults.length === 0
                  && <View className={"flex flex-col justify-center gap-y-2 h-96"}>
                        <Text className={"text-lg text-center"}>
                            No user matches your search
                        </Text>
                    </View>
                }

                {
                  searchTerm.length === 0
                  && <View className={"flex flex-col justify-center items-center h-96 w-full"}>
                        <Text className={"text-lg text-center"}>
                            What do you want to search for?
                        </Text>
                    </View>
                }
              </View>
            </TabsContent>
          </Tabs>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
    // backgroundColor: '#ffffff',
  },
  searchBox: {
    height: 40,
    // borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    // borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },
  itemText: {
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 60,
    color: '#999999',
  },
});
