import {
  ActionBar,
  ActionItem,
  Color,
  GridLayout,
  Label,
  ListView,
  Observable,
  Page,
  StackLayout,
  TapGestureEventData,
  TextView,
  View,
} from '@nativescript/core';
import type { EventData, ItemEventData } from '@nativescript/core';

import { MainViewModel } from '../view-models/main-view-model';

const dismissKeyboard = (editor: TextView): void => {
  editor.dismissSoftInput();
  editor.android?.clearFocus();
  editor.ios?.endEditing(true);
};

const createBackButton = (
  viewModel: MainViewModel,
  editor: TextView,
): ActionItem => {
  const backItem = new ActionItem();
  backItem.text = 'Back';
  backItem.visibility = 'collapsed';
  backItem.on(ActionItem.tapEvent, () => {
    dismissKeyboard(editor);
    viewModel.showList();
  });

  return backItem;
};

export const createMainPage = (viewModel: MainViewModel): Page => {
  const page = new Page();
  page.bindingContext = viewModel;

  const actionBar = new ActionBar();
  actionBar.title = 'Markdown Typer';

  const editor = new TextView();
  editor.hint = 'Start writing...';
  editor.on(TextView.textChangeEvent, (event) => {
    const value = (event.object as TextView).text ?? '';
    viewModel.updateEditorContent(value);
  });
  editor.bind(
    { sourceProperty: 'editorContent', targetProperty: 'text' },
    viewModel,
  );

  const backItem = createBackButton(viewModel, editor);
  actionBar.actionItems.addItem(backItem);

  const createItem = new ActionItem();
  createItem.text = 'New';
  createItem.on(ActionItem.tapEvent, () => {
    dismissKeyboard(editor);
    void viewModel.createNewNote();
  });
  actionBar.actionItems.addItem(createItem);

  page.actionBar = actionBar;

  const root = new GridLayout();

  const listContainer = new StackLayout();
  listContainer.className = 'screen screen-list';

  const listHeader = new Label();
  listHeader.text = 'Notes';
  listHeader.className = 'screen-title';

  const listHint = new Label();
  listHint.text = 'Tap a note to open it.';
  listHint.className = 'screen-subtitle';

  const createListButton = new Label();
  createListButton.text = '+ New note';
  createListButton.className = 'list-create-button';
  createListButton.on('tap', () => {
    dismissKeyboard(editor);
    void viewModel.createNewNote();
  });

  const listView = new ListView();
  listView.className = 'notes-list';
  listView.items = viewModel.noteListItems;
  listView.on(ListView.itemTapEvent, (event: EventData) => {
    const itemEvent = event as ItemEventData;
    const tappedNote = viewModel.noteListItems[itemEvent.index];

    if (tappedNote) {
      dismissKeyboard(editor);
      void viewModel.selectNote(tappedNote.id);
    }
  });
  listView.itemTemplate = `
    <StackLayout className="note-row">
      <Label text="{{ title }}" className="note-row-title" />
      <Label text="{{ excerpt }}" className="note-row-excerpt" textWrap="true" maxLines="2" />
    </StackLayout>
  `;

  listContainer.addChild(listHeader as View);
  listContainer.addChild(listHint as View);
  listContainer.addChild(createListButton as View);
  listContainer.addChild(listView as View);

  const detailContainer = new StackLayout();
  detailContainer.className = 'screen screen-detail';

  const detailHeader = new StackLayout();
  detailHeader.className = 'detail-header';

  const backLabel = new Label();
  backLabel.text = '← Back to notes';
  backLabel.className = 'detail-back-button';
  backLabel.on('tap', () => {
    dismissKeyboard(editor);
    viewModel.showList();
  });

  const titleLabel = new Label();
  titleLabel.className = 'detail-title';
  titleLabel.bind(
    { sourceProperty: 'selectedTitle', targetProperty: 'text' },
    viewModel,
  );

  const statusLabel = new Label();
  statusLabel.className = 'detail-status';
  statusLabel.color = new Color('#64748b');
  statusLabel.bind(
    { sourceProperty: 'statusText', targetProperty: 'text' },
    viewModel,
  );

  const errorLabel = new Label();
  errorLabel.className = 'detail-error';
  errorLabel.color = new Color('#b91c1c');
  errorLabel.textWrap = true;
  errorLabel.bind(
    { sourceProperty: 'errorMessage', targetProperty: 'text' },
    viewModel,
  );

  detailContainer.on('tap', (event: EventData) => {
    const tapEvent = event as TapGestureEventData;

    if (tapEvent.object === detailContainer) {
      dismissKeyboard(editor);
    }
  });

  detailHeader.addChild(backLabel as View);
  detailHeader.addChild(titleLabel as View);
  detailHeader.addChild(statusLabel as View);

  detailContainer.addChild(detailHeader as View);
  detailContainer.addChild(errorLabel as View);
  detailContainer.addChild(editor as View);

  const emptyState = new StackLayout();
  emptyState.className = 'screen screen-empty';

  const emptyTitle = new Label();
  emptyTitle.text = 'No note selected';
  emptyTitle.className = 'screen-title';

  const emptyHint = new Label();
  emptyHint.text = 'Choose a note from the list or create a new one.';
  emptyHint.className = 'screen-subtitle';
  emptyHint.textWrap = true;

  emptyState.addChild(emptyTitle as View);
  emptyState.addChild(emptyHint as View);

  root.addChild(listContainer as View);
  root.addChild(detailContainer as View);
  root.addChild(emptyState as View);

  const refreshLayout = (): void => {
    const isDetailScreen = viewModel.screen === 'detail';
    const hasSelection = Boolean(viewModel.selectedNote);

    actionBar.title = isDetailScreen
      ? viewModel.selectedTitle
      : 'Markdown Typer';
    backItem.visibility = isDetailScreen ? 'visible' : 'collapsed';

    listContainer.visibility = isDetailScreen ? 'collapse' : 'visible';
    detailContainer.visibility =
      isDetailScreen && hasSelection ? 'visible' : 'collapse';
    emptyState.visibility =
      !isDetailScreen && !viewModel.noteListItems.length
        ? 'visible'
        : 'collapse';

    editor.visibility = 'visible';
    errorLabel.visibility = viewModel.errorMessage ? 'visible' : 'collapse';
    listView.items = viewModel.noteListItems;
  };

  viewModel.on(Observable.propertyChangeEvent, () => {
    refreshLayout();
  });

  page.on(Page.navigatingFromEvent, () => {
    dismissKeyboard(editor);
  });

  page.on(Page.loadedEvent, () => {
    if (global.isIOS) {
      page.ios?.view.endEditing(true);
    }
  });

  refreshLayout();

  page.content = root;

  return page;
};
