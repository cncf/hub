import { isNull, isUndefined } from 'lodash';
import { memo } from 'react';

import { GatekeeperSamples, Repository } from '../../../types';
import CommandBlock from './CommandBlock';
import styles from './ContentInstall.module.css';
import PrivateRepoWarning from './PrivateRepoWarning';

interface Props {
  repository: Repository;
  samples?: GatekeeperSamples;
  relativePath: string;
}

const KubectlGatekeeperInstall = (props: Props) => {
  const firstSample: string | null = !isUndefined(props.samples) ? Object.keys(props.samples)[0] : null;
  const repoUrl: URL = new URL(props.repository.url);
  const splittedPath: string[] = repoUrl.pathname.split('/');

  return (
    <div className={`mt-3 ${styles.gatekeeperInstallContent}`}>
      <p className="text-muted">
        Instead of using <span className="fw-bold">kustomize</span>, you can directly apply the{' '}
        <code className={`border ${styles.inlineCode}`}>template.yaml</code> and the sample constraints provided in each
        directory using <span className="fw-bold">kubectl</span>.
      </p>

      <CommandBlock
        command={`git clone ${repoUrl.origin}${splittedPath.slice(0, -1).join('/')}
cd ${splittedPath[splittedPath.length - 1]}${props.relativePath}
kubectl apply -f template.yaml ${!isNull(firstSample) ? `\nkubectl apply -f samples/${firstSample}` : ''}
`}
      />

      {props.repository.private && <PrivateRepoWarning />}
    </div>
  );
};

export default memo(KubectlGatekeeperInstall);
