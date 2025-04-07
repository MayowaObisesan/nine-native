import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {getLanguageColor} from "~/lib/constants";
import {Badge} from './ui/badge';
import {Checkbox} from "~/components/ui/checkbox";
import {Text} from "~/components/ui/text";
import {LucideLock} from "lucide-react-native";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useColorScheme} from "~/lib/useColorScheme";

interface RepoCardProps {
  repo: {
    name: string;
    full_name: string;
    description: string;
    language: string;
    stargazers_count: number;
    forks_count: number;
    visibility: RepoVisibility;
  };
  onPress: () => void;
  selectedList: any;
  onSelectedList: any;
}

enum RepoVisibility {
  Public = "public",
  Private = "private"
}

const RepoCard = ({repo, onPress, selectedList, onSelectedList}: RepoCardProps) => {
  const [checked, setChecked] = React.useState(selectedList.some((item: any) => item.name === repo.name));
  const {isDarkColorScheme} = useColorScheme();

  const handlePress = () => {
    setChecked(!checked);
    onSelectedList((prevState: RepoCardProps[]) => {
      if (checked) {
        return prevState.filter((item: any) => item.name !== repo.name);
      } else {
        return [repo, ...prevState];
      }
    });
    onPress();
  }

  return (
    <Pressable
      style={({pressed}) => [
        // styles.card,
        {opacity: pressed ? 0.9 : 1}
      ]}
      onPress={handlePress}
      className={"flex flex-row items-start gap-4 px-2 py-1 max-w-full border-0 rounded-xl"}
    >
      {/*<Card className={"flex flex-row items-start gap-4 px-2 py-1 max-w-full border-0 rounded-xl"}>*/}
      <View className={"py-2"}>
        <Checkbox checked={selectedList.some((item: any) => item.name === repo.name)} onCheckedChange={setChecked}/>
      </View>

      <View className={"flex-auto"}>
        <View className={"py-0"}>
          <View className={"flex flex-row justify-between items-center gap-2"}>
            <Text className={"font-bold text-lg"}>{repo.name}</Text>
            <View>
              <Text className={"text-primary"}>
                {
                  repo.visibility === RepoVisibility.Private
                  && <LucideLock
                        size={"16"}
                        color={isDarkColorScheme ? DarkTheme.colors.text : DefaultTheme.colors.text}
                    />
                }
              </Text>
            </View>
          </View>
          {repo.description && <Text className={"text-sm"}>{repo.description}</Text>}
        </View>
        <View className={"flex flex-row justify-between items-center gap-x-4 pt-2"}>
          <View>
            {repo.language && (
              <Badge variant={"outline"} className={"flex flex-row items-center gap-2"}>
                <View className={"w-3 h-3 rounded-full"} style={{backgroundColor: getLanguageColor(repo.language)}}/>
                <Text>{repo.language}</Text>
              </Badge>
            )}
          </View>

          <View className={"flex flex-row items-center gap-4"}>

            {/*<View style={styles.footerItem}>
                <Ionicons name="star-outline" size={16} color="#666"/>
                <Text style={styles.footerText}>{repo.stargazers_count}</Text>
              </View>
              <View style={styles.footerItem}>
                <Ionicons name="git-branch-outline" size={16} color="#666"/>
                <Text style={styles.footerText}>{repo.forks_count}</Text>
              </View>*/}
          </View>
        </View>
      </View>
      {/*</Card>*/}

      {/*<View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.repoName}>{repo.name}</Text>
          <View style={styles.visibilityBadge}>
            <Text style={styles.visibilityText}>{repo.visibility}</Text>
          </View>
        </View>
        <Text style={styles.fullName}>{repo.full_name}</Text>
      </View>

      {repo.description && (
        <Text style={styles.description} numberOfLines={2}>
          {repo.description}
        </Text>
      )}

      <View style={styles.footer}>
        {repo.language && (
          <View style={styles.footerItem}>
            <View style={[styles.languageDot, {backgroundColor: getLanguageColor(repo.language)}]}/>
            <Text style={styles.footerText}>{repo.language}</Text>
          </View>
        )}
        <View style={styles.footerItem}>
          <Ionicons name="star-outline" size={16} color="#666"/>
          <Text style={styles.footerText}>{repo.stargazers_count}</Text>
        </View>
        <View style={styles.footerItem}>
          <Ionicons name="git-branch-outline" size={16} color="#666"/>
          <Text style={styles.footerText}>{repo.forks_count}</Text>
        </View>
      </View>*/}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  repoName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0366d6',
  },
  fullName: {
    fontSize: 14,
    color: '#666',
  },
  visibilityBadge: {
    backgroundColor: '#f1f8ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  visibilityText: {
    fontSize: 12,
    color: '#0366d6',
  },
  description: {
    fontSize: 14,
    color: '#444',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    gap: 16,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  languageDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

export default RepoCard;
