import {
  ActionBar,
  ActionItem,
  Color,
  FlexboxLayout,
  Label,
  ListView,
  Observable,
  Page,
  ScrollView,
  SegmentedBar,
  SegmentedBarItem,
  StackLayout,
  TextView,
  View,
} from '@nativescript/core';
import type { EventData, ItemEventData } from '@nativescript/core';

import { MainViewModel } from '../view-models/main-view-model';

const createModeToggle = (viewModel: MainViewModel): SegmentedBar => {
  const toggle = new SegmentedBar();

  const editItem = new SegmentedBarItem();
  editItem.title = 'Edit';

  const previewItem = new SegmentedBarItem();
  previewItem.title = 'Preview';

  toggle.items = [editItem, previewItem];
  toggle.selectedIndex = 0;
  toggle.on('selectedIndexChange', (event) => {
    const segmentedBar = event.object as SegmentedBar;
    viewModel.setMode(segmentedBar.selectedIndex === 0 ? 'edit' : 'preview');
  });

  return toggle;
};

const createPreviewLabel = (): View => {
  const preview = new Label();
  preview.textWrap = true;
  preview.className = 'preview';

  return preview as View;
};

export const createMainPage = (viewModel: MainViewModel): Page => {
  const page = new Page();
  page.bindingContext = viewModel;

  const actionBar = new ActionBar();
  actionBar.title = 'Markdown Typer';

  const createItem = new ActionItem();
  createItem.text = 'New';
  createItem.on(ActionItem.tapEvent, () => {
    void viewModel.createNewNote();
  });
  actionBar.actionItems.addItem(createItem);

  page.actionBar = actionBar;

  const root = new FlexboxLayout();
  root.flexDirection = 'column';

  const listView = new ListView();
  listView.items = viewModel.notes;
  listView.on(ListView.itemTapEvent, (event: EventData) => {
    const itemEvent = event as ItemEventData;
    const tappedNote = viewModel.notes[itemEvent.index];

    if (tappedNote) {
      void viewModel.selectNote(tappedNote.id);
    }
  });
  listView.itemTemplate = `
    <StackLayout padding="12" borderBottomWidth="1" borderBottomColor="#e2e8f0">
      <Label text="{{ title }}" fontWeight="600" />
      <Label text="{{ content }}" className="note-excerpt" textWrap="true" />
    </StackLayout>
  `;

  const titleLabel = new Label();
  titleLabel.fontSize = 20;
  titleLabel.fontWeight = '700';
  titleLabel.bind(
    { sourceProperty: 'selectedTitle', targetProperty: 'text' },
    viewModel,
  );

  const statusLabel = new Label();
  statusLabel.fontSize = 12;
  statusLabel.color = new Color('#64748b');
  statusLabel.bind(
    { sourceProperty: 'statusText', targetProperty: 'text' },
    viewModel,
  );

  const errorLabel = new Label();
  errorLabel.color = new Color('#b91c1c');
  errorLabel.textWrap = true;
  errorLabel.bind(
    { sourceProperty: 'errorMessage', targetProperty: 'text' },
    viewModel,
  );

  const modeToggle = createModeToggle(viewModel);

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

  const previewLabel = createPreviewLabel() as Label;
  previewLabel.bind(
    { sourceProperty: 'previewContentText', targetProperty: 'text' },
    viewModel,
  );

  const previewScroll = new ScrollView();
  previewScroll.content = previewLabel as View;

  const detail = new StackLayout();
  detail.padding = 16;
  detail.addChild(titleLabel as View);
  detail.addChild(statusLabel as View);
  detail.addChild(errorLabel as View);
  detail.addChild(modeToggle as View);
  detail.addChild(editor as View);
  detail.addChild(previewScroll as View);

  const refreshDetailVisibility = (): void => {
    const isPreview = viewModel.mode === 'preview';
    editor.visibility = isPreview ? 'collapse' : 'visible';
    previewScroll.visibility = isPreview ? 'visible' : 'collapse';
    errorLabel.visibility = viewModel.errorMessage ? 'visible' : 'collapse';
  };

  viewModel.on(Observable.propertyChangeEvent, () => {
    listView.items = viewModel.notes;
    refreshDetailVisibility();
  });

  refreshDetailVisibility();

  root.addChild(listView as View);
  root.addChild(detail as View);

  page.content = root;

  return page;
};
