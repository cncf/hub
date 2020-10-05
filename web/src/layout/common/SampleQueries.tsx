import { isUndefined, sampleSize } from 'lodash';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { SearchFiltersURL } from '../../types';
import prepareQueryString from '../../utils/prepareQueryString';

interface Props {
  className?: string;
  lineBreakIn?: number;
}

interface SampleQuery {
  label: string;
  filters: SearchFiltersURL;
}

const QUERIES: SampleQuery[] = [
  {
    label: 'OLM operators for databases',
    filters: {
      pageNumber: 1,
      tsQueryWeb: 'database',
      filters: {
        kind: ['3'],
      },
    },
  },
  {
    label: 'Helm Charts provided by Bitnami',
    filters: {
      pageNumber: 1,
      filters: {
        kind: ['0'],
        org: ['bitnami'],
      },
    },
  },
  {
    label: 'Packages of any kind related to etcd',
    filters: {
      pageNumber: 1,
      tsQueryWeb: 'etcd',
      filters: {},
    },
  },
  {
    label: 'Falco rules for CVE',
    filters: {
      pageNumber: 1,
      tsQuery: ['monitoring'],
      filters: {
        kind: ['3'],
      },
    },
  },
  {
    label: 'OLM operators in the monitoring category',
    filters: {
      pageNumber: 1,
      tsQuery: ['monitoring'],
      filters: {
        kind: ['3'],
      },
    },
  },
  {
    label: 'Packages from verified publishers',
    filters: {
      pageNumber: 1,
      filters: {},
      verifiedPublisher: true,
    },
  },
  {
    label: 'Prometheus packages in official repositories',
    filters: {
      pageNumber: 1,
      tsQueryWeb: 'prometheus',
      filters: {},
      official: true,
    },
  },
  {
    label: 'Operators with auto pilot capabilities',
    filters: {
      pageNumber: 1,
      filters: {
        capabilities: ['auto pilot'],
      },
    },
  },
  {
    label: 'Helm Charts in the storage category',
    filters: {
      pageNumber: 1,
      tsQuery: ['storage'],
      filters: {
        kind: ['0'],
      },
    },
  },
  {
    label: 'Packages with Apache-2.0 license',
    filters: {
      pageNumber: 1,
      tsQuery: [],
      filters: {
        license: ['Apache-2.0'],
      },
    },
  },
  {
    label: 'OPA policies with MIT license',
    filters: {
      pageNumber: 1,
      tsQuery: [],
      filters: {
        kind: ['2'],
        license: ['MIT'],
      },
    },
  },
];

const QUERIES_NUMBER = 5;

const SampleQueries = (props: Props) => {
  const queries = sampleSize(QUERIES, QUERIES_NUMBER);

  return (
    <>
      {queries.map((query: SampleQuery, index: number) => (
        <Fragment key={`sampleQuery_${index}`}>
          <Link
            data-testid="sampleQuery"
            className={`badge badge-pill border font-weight-normal mx-2 mt-3 ${props.className}`}
            to={{
              pathname: '/packages/search',
              search: prepareQueryString(query.filters),
            }}
          >
            {query.label}
          </Link>
          {!isUndefined(props.lineBreakIn) && index === props.lineBreakIn - 1 && (
            <div className="d-block w-100" data-testid="sampleQueryBreakLine" />
          )}
        </Fragment>
      ))}
    </>
  );
};

export default React.memo(SampleQueries);
