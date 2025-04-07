import {FlashList} from '@shopify/flash-list';
import * as React from 'react';
import {Alert, ScrollView, useWindowDimensions, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button} from '~/components/ui/button';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '~/components/ui/table';
import {Text} from '~/components/ui/text';
import {cn, formattedDate, getOwnerAndRepoFromUrl} from '~/lib/utils';
import {useGetGithubCommit, useGetGithubRepoBranches} from "~/hook/useGithub";
import {useEffect, useState} from "react";

const INVOICES = [
  {
    branch: 'INV001',
    paymentStatus: 'Paid',
    totalAmount: '$250.00',
    paymentMethod: 'Credit Card',
  },
];

const MIN_COLUMN_WIDTHS = [180, 120, 100, 120];

function TableRowComponent({item, index, columnWidths}: { item: any, index: number, columnWidths: any }) {
  const {data: commitData} = useGetGithubCommit(item.commit?.url)
  const commitDate = commitData?.commit?.committer?.date;

  return (
    <TableRow
      key={item.name}
      className={cn('active:bg-secondary', index % 2 && 'bg-muted/40 ')}
    >
      <TableCell style={{width: columnWidths[0]}} className={""}>
        <Text className={"font-medium"}>{item.name}</Text>
        <Text className={"text-sm text-muted-foreground"}>{commitData?.commit?.message}</Text>
      </TableCell>
      <TableCell style={{width: columnWidths[1]}} className={"justify-center"}>
        <Text className={"text-xs font-bold"}>
          {commitDate ? formattedDate(commitDate) : "-"}
        </Text>
      </TableCell>
      <TableCell style={{width: columnWidths[2]}}>
        <Text className={"font-bold text-sm"}>({commitData?.stats?.total})</Text>
        <Text className={"font-bold text-sm text-success"}>+{commitData?.stats?.additions}</Text>
        <Text className={"font-bold text-sm text-error"}>-{commitData?.stats?.deletions}</Text>
      </TableCell>
      {/*<TableCell style={{width: columnWidths[3]}} className='items-end '>
        <Button
          variant='secondary'
          size='sm'
          className='shadow-sm shadow-foreground/10 mr-3'
          onPress={() => {
            Alert.alert(
              invoice.totalAmount,
              `You pressed the price button on invoice ${invoice.branch}.`
            );
          }}
        >
          <Text>{invoice.totalAmount}</Text>
        </Button>
      </TableCell>*/}
    </TableRow>
  )
}

export default function BranchesCard({app, version}: { app: any, version: any }) {
  const {width} = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const columnWidths = React.useMemo(() => {
    return MIN_COLUMN_WIDTHS.map((minWidth) => {
      const evenWidth = width / MIN_COLUMN_WIDTHS.length;
      return evenWidth > minWidth ? evenWidth : minWidth;
    });
  }, [width]);

  const [page, setPage] = useState(1);
  const [allBranches, setAllBranches] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const [owner, repo] = getOwnerAndRepoFromUrl(app?.github_repo);
  const {
    data: branches,
    isLoading,
    error
  } = useGetGithubRepoBranches(owner, repo || '', page);

  useEffect(() => {
    if (branches) {
      if (branches.length === 0) {
        setHasMore(false);
      } else {
        setAllBranches(prev => [...prev, ...branches]);
      }
    }
  }, [branches]);

  const renderItem = ({item, index}: { item: any, index: number }) => (
    <TableRowComponent item={item} index={index} columnWidths={columnWidths}/>
  )

  const loadMoreFollowers = () => {
    if (!isLoading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <ScrollView horizontal bounces={false} showsHorizontalScrollIndicator={false}>
      <Table aria-labelledby='invoice-table'>
        <TableHeader>
          <TableRow>
            <TableHead className='px-0.5' style={{width: columnWidths[0]}}>
              <Text>Branch</Text>
            </TableHead>
            <TableHead style={{width: columnWidths[1]}}>
              <Text>Updated</Text>
            </TableHead>
            <TableHead style={{width: columnWidths[2]}}>
              <Text>Stats</Text>
            </TableHead>
            {/*<TableHead style={{width: columnWidths[3]}}>
              <Text className='text-center md:text-right md:pr-5'>Amount</Text>
            </TableHead>*/}
          </TableRow>
        </TableHeader>
        <TableBody>
          <FlashList
            data={version}
            estimatedItemSize={45}
            contentContainerStyle={{
              paddingBottom: insets.bottom,
            }}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            keyExtractor={(item) => item.name.toString()}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center p-4">
                <Text>No results found</Text>
              </View>
            }
            onEndReached={loadMoreFollowers}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() => {
              return (
                <>
                  {/*<TableFooter>
                    <TableRow>
                      <TableCell className='flex-1 justify-center'>
                        <Text className='text-foreground'>Total</Text>
                      </TableCell>
                      <TableCell className='items-end pr-8'>
                        <Button
                          size='sm'
                          variant='ghost'
                          onPress={() => {
                            Alert.alert(
                              'Total Amount',
                              `You pressed the total amount price button.`
                            );
                          }}
                        >
                          <Text>$2,500.00</Text>
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableFooter>*/}
                  <View className='items-center py-3 ios:pb-0'>
                    <Text
                      nativeID='invoice-table'
                      className='items-center text-sm text-muted-foreground'
                    >
                      An overview of some branches.
                    </Text>
                  </View>
                </>
              );
            }}
          />
        </TableBody>
      </Table>
    </ScrollView>
  );
}
