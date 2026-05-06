package library

import (
	libraryapi "taptype/api/library"
	libraryService "taptype/internal/service/library"
)

type ControllerV1 struct {
	librarySvc libraryService.Service
}

func NewV1(librarySvc libraryService.Service) libraryapi.ILibraryV1 {
	return &ControllerV1{librarySvc: librarySvc}
}
