# Changelog

## Version [3.7.0](https://github.com/cedx/core.js/compare/v3.6.0...v3.7.0)
- Raised the maximum allowed value of the `PaginationState.itemsPerPage` property to `1000`.

## Version [3.6.0](https://github.com/cedx/core.js/compare/v3.5.1...v3.6.0)
- Modified the return type of the `Typeahead` handler.

## Version [3.5.1](https://github.com/cedx/core.js/compare/v3.5.0...v3.5.1)
- Fix a regression in the `ThemeDropdown` component.

## Version [3.5.0](https://github.com/cedx/core.js/compare/v3.4.1...v3.5.0)
- Moved the `Data.Context` class to the `Web` module.
- Removed the `Data.Scenario` enumeration.
- Removed the `IO.ImageFormat` enumeration.
- Renamed the `Html` module to `Web.Html`.
- Renamed the `UI` module to `Web.UI`.
- Renamed the `Web.Html.Theme` enumeration to `ThemeMode`.

## Version [3.4.1](https://github.com/cedx/core.js/compare/v3.4.0...v3.4.1)
- Fixed a packaging issue.

## Version [3.4.0](https://github.com/cedx/core.js/compare/v3.3.0...v3.4.0)
- Moved the classes from the `Util` module to the root.
- Removed the `Net.PostalAddress` class.
- Renamed the `Http` module to `Net.Http`.
- Renamed the `Http.Client` class to `HttpClient`.
- Renamed the `Http.Error` class to `HttpError`.
- Renamed the `Http.Status` enumeration to `StatusCodes`.

## Version [3.3.0](https://github.com/cedx/core.js/compare/v3.2.0...v3.3.0)
- Removed the `DateRange` class.
- Removed the `setState()` middleware.
- Renamed the `Async` module to `Threading`.
- Renamed the `Cache` and `CacheSerializer` interfaces to `ICache` and `ICacheSerializer`.
- Renamed the `Pagination` class to `PaginationState`.
- Renamed the `Region` class to `RegionInfo`.
- Renamed the `Sort` class to `SortState`.
- Renamed the `SortEntry` type to `SortedProperty`.
- Renamed the `SortOrder` enumeration to `SortDirection`.
- Renamed the `Task.value` property to `result`.
- Renamed the values of the `TaskStatus` enumeration.
- Moved the `PaginationState` and `Sort` classes to the `Web` module.
- Added the `ICache.getOrCreate()` method.
- Added the `isCompleted`, `isCompletedSuccessfully` and `isFaulted` properties to the `Task` class.

## Version [3.2.0](https://github.com/cedx/core.js/compare/v3.1.0...v3.2.0)
- Renamed the `DI` module to `DependencyInjection`.
- Renamed the `Intl` module to `Globalization`.
- Renamed the `InternetAddress` class to `IPAddress`.

## Version [3.1.0](https://github.com/cedx/core.js/compare/v3.0.0...v3.1.0)
- Use Pascal case for enumerated values.

## Version [3.0.0](https://github.com/cedx/core.js/compare/v2.1.1...v3.0.0)
- Breaking change: use Pascal case as file naming convention.

## Version [2.1.1](https://github.com/cedx/core.js/compare/v2.1.0...v2.1.1)
- Updated the project URL.

## Version [2.1.0](https://github.com/cedx/core.js/compare/v2.0.2...v2.1.0)
- Added the `imageTypes` set.
- Added the `ScrollTo` component.

## Version [2.0.2](https://github.com/cedx/core.js/compare/v2.0.1...v2.0.2)
- Fixed the `Toaster` component.

## Version [2.0.1](https://github.com/cedx/core.js/compare/v2.0.0...v2.0.1)
- Removed the `postinstall` script.

## Version [2.0.0](https://github.com/cedx/core.js/compare/v1.8.0...v2.0.0)
- Ported the source code to [TypeScript](https://www.typescriptlang.org).
- Breaking change: renamed the `html/ui` module to `ui`.
- Breaking change: moved the `Clock`, `Component` and `Router` classes to the `ui` module.
- Breaking change: moved the `newLineToBr()` directive to the `ui` module.

## Version [1.8.0](https://github.com/cedx/core.js/compare/v1.7.0...v1.8.0)
- Added the `ImageFormat` enumeration.
- Added the `Task` class.

## Version [1.7.0](https://github.com/cedx/core.js/compare/v1.6.0...v1.7.0)
- Added the `Toaster` component.
- Added the `liveReload()` functions.
- Removed the `assertIdentifier()` and `isIdentifier()` functions.

## Version [1.6.0](https://github.com/cedx/core.js/compare/v1.5.0...v1.6.0)
- Added the `FullScreenToggler` and `Typeahead` components.

## Version [1.5.0](https://github.com/cedx/core.js/compare/v1.4.0...v1.5.0)
- Added the `locale` parameter to the `capitalize()` function.
- Added the `PostalAddress` class.

## Version [1.4.0](https://github.com/cedx/core.js/compare/v1.3.0...v1.4.0)
- Added the `MessageBox` component.
- Added the `Clock` controller.
- Fixed the `Client._fetch()` method.

## Version [1.3.0](https://github.com/cedx/core.js/compare/v1.2.2...v1.3.0)
- Added the `ThemeDropdown.storageKey` property.

## Version [1.2.2](https://github.com/cedx/core.js/compare/v1.2.1...v1.2.2)
- Fixed the `PageTitle` component.

## Version [1.2.1](https://github.com/cedx/core.js/compare/v1.2.0...v1.2.1)
- Fixed the registration of Web components.

## Version [1.2.0](https://github.com/cedx/core.js/compare/v1.1.1...v1.2.0)
- Added the `Component` abstract class.
- Added the `ActionBar`, `LoadingIndicator`, `OfflineIndicator`, `PageTitle`, `RedirectTo` and `ThemeDropdown` components.
- Added the `Router` service.
- Added the `newLineToBr()` directive.

## Version [1.1.1](https://github.com/cedx/core.js/compare/v1.1.0...v1.1.1)
- Fixed the `split()` and `xmlEscape()` functions.

## Version [1.1.0](https://github.com/cedx/core.js/compare/v1.0.0...v1.1.0)
- Added the `setState()` HTTP middleware.

## Version 1.0.0
- Initial release.
