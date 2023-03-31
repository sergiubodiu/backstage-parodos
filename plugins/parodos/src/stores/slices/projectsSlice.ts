import type { StateCreator } from 'zustand';
import type { ProjectsSlice, State, StateMiddleware } from '../types';
import * as urls from '../../urls';
import { unstable_batchedUpdates } from 'react-dom';
import { type Project, projectSchema } from '../../models/project';

export const createProjectsSlice: StateCreator<
  State,
  StateMiddleware,
  [],
  ProjectsSlice
> = (set, get) => ({
  projectsLoading: true,
  projectsError: undefined,
  hasProjects() {
    return get().projects.length > 0;
  },
  projects: [],
  async fetchProjects() {
    set(state => {
      state.projectsLoading = true;
    });

    try {
      const response = await fetch(`${get().baseUrl}${urls.Projects}`);
      const projectsResponse = await response.json();

      const projects = projectsResponse.map(projectSchema.parse) as Project[];

      set(state => {
        unstable_batchedUpdates(() => {
          state.projects = projects;
          state.projectsLoading = false;
        });
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('fetchProjects error: ', e);
      set(state => {
        state.projectsError = e as Error;
      });
    }
  },
  addProject(project) {
    set(state => {
      state.projects.push(project);
    });
  },
});
