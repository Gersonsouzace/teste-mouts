import * as allure from 'allure-js-commons';

/**
 * Aplica metadados do Allure (epic/feature/story/severity/tags) ao teste corrente.
 * @param {{ epic?: string, feature?: string, story?: string, severity?: string, tags?: string[] }} meta
 */
export const allureMeta = ({ epic, feature, story, severity, tags = [] }) => {
  if (epic) allure.epic(epic);
  if (feature) allure.feature(feature);
  if (story) allure.story(story);
  if (severity) allure.severity(severity);
  tags.forEach((tag) => allure.tag(tag));
};

export const { Severity } = allure;
