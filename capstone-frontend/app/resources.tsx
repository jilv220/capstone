import BackButton from '@/components/navigation/BackButton';
import { List, Search } from '@tamagui/lucide-icons';
import { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { Button, Input, ListItem, ScrollView, Text, XStack, YGroup, YStack } from 'tamagui';

export default function ResourcesScreen() {
  const testResources = [
    { title: 'Vancouver Coastal Health', content: 'http://www.vch.ca' },
    { title: 'BC Centre for Disease Control', content: 'http://www.bccdc.ca' },
    { title: 'HealthLink BC', content: 'https://www.healthlinkbc.ca' },
    { title: 'BC Mental Health & Substance Use Services', content: 'http://www.bcmhsus.ca' },
    { title: 'Providence Health Care', content: 'http://www.providencehealthcare.org' },
    { title: 'BC Cancer', content: 'http://www.bccancer.bc.ca' },
    { title: "BC Women's Hospital + Health Centre", content: 'http://www.bcwomens.ca' },
    { title: "BC Children's Hospital", content: 'http://www.bcchildrens.ca' },
    {
      title: "St. Paul's Hospital",
      content: 'http://www.providencehealthcare.org/hospitals-residences/st-pauls-hospital',
    },
    {
      title: 'Richmond Hospital',
      content: 'http://www.vch.ca/Locations-Services/result?res_id=1326',
    },
    { title: 'Canadian Mental Health Association BC Division', content: 'https://cmha.bc.ca' },
    { title: 'BounceBack BC', content: 'https://bouncebackbc.ca' },
    { title: 'Anxiety Canada', content: 'https://www.anxietycanada.com' },
    { title: 'Crisis Centre BC', content: 'https://crisiscentre.bc.ca' },
    { title: 'Foundry BC', content: 'https://foundrybc.ca' },
    {
      title: 'Vancouver Division of Family Practice',
      content: 'https://www.divisionsbc.ca/vancouver',
    },
    { title: 'Vancouver Aboriginal Health Society', content: 'http://www.vahs.life' },
    { title: 'Family Services of Greater Vancouver', content: 'https://fsgv.ca' },
    {
      title: 'SUCCESS - Social Services',
      content: 'https://www.successbc.ca/eng/services/social-services',
    },
    { title: 'REACH Community Health Centre', content: 'https://reachcentre.bc.ca' },
    { title: 'Mosaic', content: 'https://www.mosaicbc.org' },
    { title: 'YWCA Metro Vancouver', content: 'https://ywcavan.org' },
    { title: 'BC SPCA - Animal Welfare', content: 'https://spca.bc.ca' },
    { title: 'Pain BC', content: 'https://www.painbc.ca' },
    { title: 'Positive Living BC', content: 'http://www.positivelivingbc.org' },
  ];
  const [resources, setResources] = useState(testResources);
  const searchResources = (searchItem: string) => {
    searchItem = searchItem.toLowerCase();
    if (searchItem !== '') {
      const filteredResources = testResources.filter(
        (resource) =>
          resource.title.toLowerCase().includes(searchItem) ||
          resource.content.toLowerCase().includes(searchItem)
      );
      setResources(filteredResources);
    } else {
      setResources(testResources);
    }
  };

  useEffect(() => {}, [resources]);
  return (
    <YStack px={'$4'} py={'$10'}>
      <XStack>
        <BackButton />
      </XStack>
      <XStack alignItems="center" pb="$3">
        <Input
          borderColor={'yellowgreen'}
          focusStyle={{ borderColor: 'yellowgreen', borderWidth: 3 }}
          borderWidth={2}
          elevation={2}
          flex={1}
          size={'$4'}
          placeholder="search resources..."
          onChangeText={(text) => {
            searchResources(text);
          }}
        ></Input>
      </XStack>
      <ScrollView>
        <YGroup alignSelf="center" width={'100%'} size={'$3'}>
          {resources.map((res, index) => {
            return (
              <YGroup.Item key={index}>
                <ListItem
                  title={res.content}
                  subTitle={res.title}
                  bordered
                  onPress={() => {
                    Linking.openURL(res.content);
                  }}
                ></ListItem>
              </YGroup.Item>
            );
          })}
        </YGroup>
      </ScrollView>
    </YStack>
  );
}
