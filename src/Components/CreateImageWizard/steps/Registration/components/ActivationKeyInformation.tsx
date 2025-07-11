import React from 'react';

import {
  Alert,
  Spinner,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Content,
  ContentVariants,
  Button,
  Popover,
} from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

import { useAppSelector } from '../../../../../store/hooks';
import { useShowActivationKeyQuery } from '../../../../../store/rhsmApi';
import { selectActivationKey } from '../../../../../store/wizardSlice';

const ActivationKeyInformation = (): JSX.Element => {
  const activationKey = useAppSelector(selectActivationKey);

  const {
    data: activationKeyInfo,
    isFetching: isFetchingActivationKeyInfo,
    isSuccess: isSuccessActivationKeyInfo,
    isError: isErrorActivationKeyInfo,
  } = useShowActivationKeyQuery(
    { name: activationKey! },
    {
      skip: !activationKey,
    }
  );

  return (
    <>
      {isFetchingActivationKeyInfo && <Spinner size="lg" />}
      {isSuccessActivationKeyInfo && (
        <DescriptionList isCompact>
          <DescriptionListGroup>
            <DescriptionListTerm>Name</DescriptionListTerm>
            <DescriptionListDescription>
              <Content component={ContentVariants.p}>{activationKey}</Content>
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Role</DescriptionListTerm>
            <DescriptionListDescription>
              <Content component={ContentVariants.p}>
                {activationKeyInfo?.body?.role || 'Not defined'}
              </Content>
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>SLA</DescriptionListTerm>
            <DescriptionListDescription>
              <Content component={ContentVariants.p}>
                {activationKeyInfo?.body?.serviceLevel || 'Not defined'}
              </Content>
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Usage</DescriptionListTerm>
            <DescriptionListDescription>
              <Content component={ContentVariants.p}>
                {activationKeyInfo?.body?.usage || 'Not defined'}
              </Content>
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Additional repositories</DescriptionListTerm>
            <DescriptionListDescription>
              {activationKeyInfo?.body?.additionalRepositories &&
              activationKeyInfo?.body?.additionalRepositories?.length > 0 ? (
                <Popover
                  position="right"
                  minWidth="30rem"
                  bodyContent={
                    <>
                      <Content component={ContentVariants.h3}>
                        Additional repositories
                      </Content>
                      <Table
                        aria-label="Additional repositories table"
                        variant="compact"
                      >
                        <Thead>
                          <Tr>
                            <Th>Name</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {activationKeyInfo.body?.additionalRepositories?.map(
                            (repo, index) => (
                              <Tr key={index}>
                                <Td>{repo.repositoryLabel}</Td>
                              </Tr>
                            )
                          )}
                        </Tbody>
                      </Table>
                    </>
                  }
                >
                  <Button
                    variant="link"
                    aria-label="Show additional repositories"
                  >
                    {activationKeyInfo.body?.additionalRepositories?.length}{' '}
                    repositories
                  </Button>
                </Popover>
              ) : (
                <Content component={ContentVariants.p}>None</Content>
              )}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      )}
      {isErrorActivationKeyInfo && (
        <>
          <DescriptionList isCompact>
            <DescriptionListGroup>
              <DescriptionListTerm>Name</DescriptionListTerm>
              <DescriptionListDescription>
                <Content component={ContentVariants.p}>{activationKey}</Content>
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
          <br />
          <Alert
            title="Information about the activation key unavailable"
            variant="danger"
            isPlain
            isInline
          >
            Information about the activation key cannot be loaded. Please check
            the key was not removed and try again later.
          </Alert>
        </>
      )}
    </>
  );
};

export default ActivationKeyInformation;
