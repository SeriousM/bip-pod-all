/**
 *
 * The Bipio NewPost Pod.  Wordpress - create a post
 * ---------------------------------------------------------------
 *
 * @author Michael Pearson <michael@cloudspark.com.au>
 * Copyright (c) 2010-2013 CloudSpark pty ltd http://www.cloudspark.com.au
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

function NewPost(podConfig) {
    this.name = 'new_post';
    this.description = 'Create a Post',
    this.description_long = 'Creates a new Post.  Any GIF/JPEG/PNG files present will be added to the post',
    this.trigger = false; // this action can trigger
    this.singleton = false; // only 1 instance per account (can auto install)
    this.auto = false; // no config, not a singleton but can auto-install anyhow
    this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

NewPost.prototype = {};

NewPost.prototype.getSchema = function() {
    return {
        'config' : { // config schema
            properties : {
                'status' : {
                    type : 'string',
                    description : 'Post Status',
                    oneOf : [
                        {
                            "$ref" : "#/definitions/post_status"
                        }
                    ]
                },
                'format' : {
                    type : 'string',
                    description : 'Post Format',
                    oneOf : [
                        {
                            "$ref" : "#/definitions/post_format"
                        }
                    ]
                },
                'comments_allowed' : {
                    type : 'string',
                    description : 'Allow Comments',
                    oneOf : [
                        {
                            "$ref" : "#/definitions/bool"
                        }
                    ]
                },
                'site' : { 
                    type : 'string',
                    description : 'Site ID or Site domain'
                }
            },
            definitions : {
                "post_status" : {
                    "description" : "Post Status",
                    "enum" : [ "publish" , "private", "draft", "pending" ],
                    "enum_label" : ["Publish", "Privately Publish", "Save as Draft", "Mark Pending Approval"],
                    "default" : "publish"
                },
                "post_format" : {
                    "description" : "Post Format",
                    "enum" : [ "standard" , "aside", "chat", "gallery", "link", "image", "quote", "status", "video", "audio" ],
                    "enum_label" : ["Standard" , "Aside", "Chat", "Gallery", "Link", "Image", "Quote", "Status", "Video", "Audio"],
                    "default" : "standard"
                },
                "bool" : {
                    "description" : "Toggle",
                    "enum" : [ "true" , "false", "none" ],
                    "enum_label" : ["On" , "Off", "Account Default"],
                    "default" : "none"
                }
            }
        },
        'exports' : {
            properties : {
                '' : {
                    type : 'string',
                    description : ''
                }
            }
        },
        "imports": {
            properties : {
                '' : {
                    type : 'string',
                    description : ''
                }
            }
        }
    }
}

/**
 * Invokes (runs) the action.
 */
NewPost.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
    // whatever comes in, we push straight back out
    next(
        false,
        {
            "outstring" : imports.instring
        }
        );
}

// -----------------------------------------------------------------------------
module.exports = NewPost;