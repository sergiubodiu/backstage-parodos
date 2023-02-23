import React from 'react';
import {
  ContentHeader,
  Link,
  Select,
  SelectedItems,
  SupportButton,
} from '@backstage/core-components';
import Add from '@material-ui/icons/Add';
import { Grid } from '@material-ui/core';
import { useAsync } from 'react-use';

import { EmptyProjectsState } from './EmptyProjectsState';
import { useCommonStyles } from '../../styles';
import { ParodosPage } from '../ParodosPage';
import { ProjectStatusType, ProjectType } from './types';
import { ProjectsTable } from './ProjectsTable';
import { mockProjects } from './mockData';

const projectFilterItems: { label: string; value: ProjectStatusType }[] = [
  { label: 'All Projects', value: 'all-projects' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'On Boarded', value: 'on-boarded' },
];

export const ProjectOverviewPage = () => {
  const commonStyles = useCommonStyles();
  const [projectFilter, setProjectFilter] = React.useState('all-projects');
  const [filteredProjects, setFilteredProjects] = React.useState<ProjectType[]>(
    [],
  );

  const {
    value: allProjects,
    loading: loadingProjects,
    error: errorProjects,
  } = useAsync(async (): Promise<ProjectType[]> => {
    // TODO: proxy does not work so far
    // TODO: https://issues.redhat.com/browse/FLPATH-131
    // const response = await fetch('/api/proxy/parodos/projects', {
    //   method: 'GET',
    //   cache: 'no-cache',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     accept: 'application/json',
    //     Authorization: 'Basic dGVzdDp0ZXN0' /* TODO: test:test */,
    //   },
    //   redirect: 'follow',
    // });
    // const data = await response.json();
    // console.log('--data: ', data);
    // return data.results;
    return mockProjects;
  }, []);

  React.useEffect(() => {
    if (!allProjects) {
      setFilteredProjects([]);
      return;
    }

    let filtered = allProjects;
    if (projectFilter !== 'all-projects') {
      filtered = allProjects.filter(
        project => project.status === projectFilter,
      );
    }
    setFilteredProjects(filtered);
  }, [allProjects, projectFilter]);

  const onFilterProjects = (selected: SelectedItems) => {
    setProjectFilter(
      selected as ProjectStatusType /* we have single-selection here */,
    );
  };

  let content: React.ReactElement | null = null;
  if (loadingProjects) {
    content = <div>Loading...</div>;
  } else if (errorProjects) {
    content = <div>Error: {errorProjects.message}</div>;
  } else if (allProjects && allProjects.length > 0) {
    content = (
      <Grid container direction="row" spacing={0}>
        <Grid item xs={3}>
          <Select
            onChange={onFilterProjects}
            label="Filter by"
            items={projectFilterItems}
            selected={projectFilter}
          />
        </Grid>

        <Grid item xs={9}>
          <ProjectsTable projects={filteredProjects} />
        </Grid>
      </Grid>
    );
  } else {
    content = <EmptyProjectsState />;
  }

  return (
    <ParodosPage>
      <ContentHeader title="Projects overview">
        <Link to="/parodos/workflow">
          <Add className={commonStyles.inlineicon} />
          &nbsp;Add new project
        </Link>

        <SupportButton title="Need help?">Lorem Ipsum</SupportButton>
      </ContentHeader>

      {content}
    </ParodosPage>
  );
};
