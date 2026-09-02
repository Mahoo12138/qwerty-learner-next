package v1

import (
	"github.com/gogf/gf/v2/frame/g"
)

type GetProfileReq struct {
	g.Meta `path:"/adaptive/profile" method:"get" tags:"Adaptive" summary:"Get user's adaptive weakness profile"`
}
type GetProfileRes struct {
	Profile interface{} `json:"profile"`
}

type CreateAdaptiveSessionReq struct {
	g.Meta    `path:"/adaptive/sessions" method:"post" tags:"Adaptive" summary:"Create adaptive practice session targeting weak keys"`
	ItemCount int `json:"item_count" v:"min:1|max:200"`
}
type CreateAdaptiveSessionRes struct {
	Session      interface{} `json:"session"`
	Words        interface{} `json:"words,omitempty"`
	TargetedKeys []string    `json:"targeted_keys"`
}
